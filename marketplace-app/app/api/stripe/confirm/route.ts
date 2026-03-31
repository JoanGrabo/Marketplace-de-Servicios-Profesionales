import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getStripeClient } from "@/lib/stripe";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ ok: false, message: "No autenticado." }, { status: 401 });
    }

    let body: { sessionId?: unknown };
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ ok: false, message: "Cuerpo no válido." }, { status: 400 });
    }

    const sessionId = String(body.sessionId ?? "").trim();
    if (!sessionId) {
      return NextResponse.json({ ok: false, message: "Falta sessionId." }, { status: 400 });
    }

    const stripe = getStripeClient();
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    const metadata = (session.metadata ?? {}) as {
      orderId?: string;
      purpose?: string;
      serviceId?: string;
      promotionDays?: string;
    };

    if (session.payment_status !== "paid") {
      return NextResponse.json({ ok: false, message: "Pago no confirmado todavía." }, { status: 409 });
    }

    // Marcar el pedido como pagado (idempotente).
    if (metadata.orderId) {
      await prisma.order.updateMany({
        where: { id: metadata.orderId },
        data: {
          status: "paid",
          paidAt: new Date(),
          stripePaymentIntentId: typeof session.payment_intent === "string" ? session.payment_intent : null,
        },
      });
    } else {
      await prisma.order.updateMany({
        where: { stripeCheckoutSessionId: session.id },
        data: {
          status: "paid",
          paidAt: new Date(),
          stripePaymentIntentId: typeof session.payment_intent === "string" ? session.payment_intent : null,
        },
      });
    }

    // Aplicar destacado si corresponde.
    if (metadata.purpose === "promote_service" && metadata.serviceId) {
      const daysRaw = Number(metadata.promotionDays ?? "");
      const days = Number.isFinite(daysRaw) && daysRaw > 0 ? Math.floor(daysRaw) : 7;
      const promoExpiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
      await prisma.service.updateMany({
        where: { id: metadata.serviceId, profileId: user.id },
        data: { isPromoted: true, promoExpiresAt },
      });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error("stripe confirm:", e);
    const msg = e instanceof Error ? e.message : "No se pudo confirmar el pago.";
    return NextResponse.json({ ok: false, message: msg }, { status: 500 });
  }
}

