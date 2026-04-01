import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { getAppBaseUrl, getStripeClient } from "@/lib/stripe";

function getPromotionPriceCents(): number {
  const raw = Number(process.env.PROMOTION_PRICE_CENTS ?? "");
  if (Number.isFinite(raw) && raw > 0) return Math.floor(raw);
  return 1500; // 15,00€
}

function getPromotionDays(): number {
  const raw = Number(process.env.PROMOTION_DAYS ?? "");
  if (Number.isFinite(raw) && raw > 0) return Math.floor(raw);
  return 30;
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ ok: false, message: "Debes iniciar sesión." }, { status: 401 });
    }

    let body: { serviceId?: unknown };
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ ok: false, message: "Cuerpo de la petición no válido." }, { status: 400 });
    }

    const serviceId = String(body.serviceId ?? "").trim();
    if (!serviceId) {
      return NextResponse.json({ ok: false, message: "Falta el servicio." }, { status: 400 });
    }

    const service = await prisma.service.findFirst({
      where: { id: serviceId, profileId: user.id, active: true },
      select: { id: true, title: true, isPromoted: true, promoExpiresAt: true },
    });
    if (!service) {
      return NextResponse.json({ ok: false, message: "Servicio no encontrado." }, { status: 404 });
    }

    const stripe = getStripeClient();
    const baseUrl = getAppBaseUrl();
    const amount = getPromotionPriceCents();
    const days = getPromotionDays();

    const order = await prisma.order.create({
      data: {
        serviceId: service.id,
        buyerId: user.id,
        sellerId: user.id,
        amountCents: amount,
        currency: "EUR",
        status: "pending",
      },
      select: { id: true },
    });

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: user.email,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "eur",
            unit_amount: amount,
            product_data: {
              name: `Destacar/renovar servicio (${days} días)`,
              description: service.title,
            },
          },
        },
      ],
      metadata: {
        purpose: "promote_service",
        orderId: order.id,
        serviceId: service.id,
        promoterId: user.id,
        promotionDays: String(days),
      },
      success_url: `${baseUrl}/pago/exito?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/pago/cancelado?order_id=${encodeURIComponent(order.id)}`,
    });

    await prisma.order.update({ where: { id: order.id }, data: { stripeCheckoutSessionId: session.id } });

    return NextResponse.json({ ok: true, url: session.url });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error("stripe promote:", e);
    const msg = e instanceof Error ? e.message : "No se pudo iniciar el pago.";
    return NextResponse.json({ ok: false, message: msg }, { status: 500 });
  }
}

