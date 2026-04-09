import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { getAppBaseUrl, getStripeClient } from "@/lib/stripe";

export async function POST(req: Request) {
  try {
    return NextResponse.json(
      {
        ok: false,
        message:
          "Pagos por servicio desactivados temporalmente. Contacta con el profesional para acordar el encargo.",
      },
      { status: 410 },
    );

    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ ok: false, message: "Debes iniciar sesión para pagar." }, { status: 401 });
    }

    let body: { serviceSlug?: unknown };
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ ok: false, message: "Cuerpo de la petición no válido." }, { status: 400 });
    }

    const serviceSlug = String(body.serviceSlug ?? "").trim();
    if (!serviceSlug) {
      return NextResponse.json({ ok: false, message: "Falta el servicio." }, { status: 400 });
    }

    const service = await prisma.service.findUnique({
      where: { slug: serviceSlug },
      include: { profile: { select: { id: true, email: true, displayName: true } } },
    });
    if (!service || !service.active) {
      return NextResponse.json({ ok: false, message: "Servicio no encontrado." }, { status: 404 });
    }
    if (service.profile.id === user.id) {
      return NextResponse.json({ ok: false, message: "No puedes pagar tu propio servicio." }, { status: 400 });
    }
    if (!Number.isFinite(service.priceCents) || service.priceCents <= 0) {
      return NextResponse.json({ ok: false, message: "Este servicio no tiene un precio válido." }, { status: 400 });
    }

    const order = await prisma.order.create({
      data: {
        serviceId: service.id,
        buyerId: user.id,
        sellerId: service.profile.id,
        amountCents: service.priceCents,
        currency: "EUR",
        status: "pending",
      },
      select: { id: true },
    });

    const stripe = getStripeClient();
    const baseUrl = getAppBaseUrl();

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: user.email,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "eur",
            unit_amount: service.priceCents,
            product_data: {
              name: service.title,
              description: service.shortDescription ?? undefined,
            },
          },
        },
      ],
      metadata: {
        orderId: order.id,
        serviceId: service.id,
        buyerId: user.id,
        sellerId: service.profile.id,
      },
      success_url: `${baseUrl}/pago/exito?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/pago/cancelado?order_id=${encodeURIComponent(order.id)}`,
    });

    await prisma.order.update({
      where: { id: order.id },
      data: { stripeCheckoutSessionId: session.id },
    });

    return NextResponse.json({ ok: true, url: session.url, orderId: order.id });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error("stripe checkout:", e);
    const msg = e instanceof Error ? e.message : "No se pudo iniciar el pago. Inténtalo más tarde.";
    return NextResponse.json({ ok: false, message: msg }, { status: 500 });
  }
}

