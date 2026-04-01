import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getStripeClient } from "@/lib/stripe";

function getWebhookSecret(): string {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) throw new Error("STRIPE_WEBHOOK_SECRET no está configurada.");
  if (!secret.startsWith("whsec_")) {
    throw new Error('STRIPE_WEBHOOK_SECRET no parece válida (debe empezar por "whsec_").');
  }
  return secret;
}

export async function POST(req: Request) {
  try {
    const stripe = getStripeClient();
    const sig = req.headers.get("stripe-signature");
    if (!sig) {
      return NextResponse.json({ ok: false, message: "Falta stripe-signature." }, { status: 400 });
    }

    const rawBody = await req.text();

    let event;
    try {
      event = stripe.webhooks.constructEvent(rawBody, sig, getWebhookSecret());
    } catch (err) {
      return NextResponse.json({ ok: false, message: "Firma inválida." }, { status: 400 });
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as unknown as {
        id: string;
        payment_intent?: string | null;
        metadata?: { orderId?: string; purpose?: string; serviceId?: string; promotionDays?: string };
      };
      const orderId = session.metadata?.orderId;
      const purpose = session.metadata?.purpose;
      if (orderId) {
        await prisma.order.updateMany({
          where: { id: orderId, status: "pending" },
          data: {
            status: "paid",
            paidAt: new Date(),
            stripePaymentIntentId: session.payment_intent ?? null,
          },
        });
      } else {
        // fallback por si se perdió metadata
        await prisma.order.updateMany({
          where: { stripeCheckoutSessionId: session.id, status: "pending" },
          data: {
            status: "paid",
            paidAt: new Date(),
            stripePaymentIntentId: session.payment_intent ?? null,
          },
        });
      }

      if (purpose === "promote_service") {
        const serviceId = session.metadata?.serviceId;
        const daysRaw = Number(session.metadata?.promotionDays ?? "");
        const days = Number.isFinite(daysRaw) && daysRaw > 0 ? Math.floor(daysRaw) : 30;
        if (serviceId) {
          const now = new Date();
          const svc = await prisma.service.findUnique({
            where: { id: serviceId },
            select: { promoExpiresAt: true },
          });
          const base = svc?.promoExpiresAt && svc.promoExpiresAt > now ? svc.promoExpiresAt : now;
          const promoExpiresAt = new Date(base.getTime() + days * 24 * 60 * 60 * 1000);
          await prisma.service.updateMany({ where: { id: serviceId }, data: { isPromoted: true, promoExpiresAt } });
        }
      }
    }

    if (event.type === "checkout.session.expired") {
      const session = event.data.object as unknown as { id: string; metadata?: { orderId?: string } };
      const orderId = session.metadata?.orderId;
      if (orderId) {
        await prisma.order.updateMany({
          where: { id: orderId, status: "pending" },
          data: { status: "canceled" },
        });
      } else {
        await prisma.order.updateMany({
          where: { stripeCheckoutSessionId: session.id, status: "pending" },
          data: { status: "canceled" },
        });
      }
    }

    return NextResponse.json({ received: true });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error("stripe webhook:", e);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

