import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { canSendMail, sendMail } from "@/lib/mailer";
import { getMessageCooldownSeconds, validateMessageBody } from "@/lib/validation";
import { resolveRouteParams, safeDecodeURIComponent } from "@/lib/routeParams";
import { rateLimit } from "@/lib/rateLimit";

type Params = {
  params: {
    slug: string;
  } | Promise<{
    slug: string;
  }>;
};

export async function POST(req: Request, context: Params) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const rl = rateLimit(`contact:${ip}`, { limit: 20, windowMs: 60_000 });
    if (!rl.ok) {
      return NextResponse.json(
        { ok: false, message: `Demasiados mensajes. Espera ${rl.retryAfterSeconds}s.` },
        { status: 429 },
      );
    }

    const { slug: rawSlug } = await resolveRouteParams(context.params);
    const slug = safeDecodeURIComponent(String(rawSlug ?? ""));

    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ ok: false, message: "Debes iniciar sesión para contactar." }, { status: 401 });
    }

    const servicio = await prisma.service.findUnique({
      where: { slug },
      include: {
        profile: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });

    if (!servicio || !servicio.active) {
      return NextResponse.json({ ok: false, message: "Servicio no encontrado." }, { status: 404 });
    }

    if (servicio.profile.id === user.id) {
      return NextResponse.json(
        { ok: false, message: "No puedes enviarte mensajes a ti mismo." },
        { status: 400 },
      );
    }

    let body: { message?: unknown };
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ ok: false, message: "Cuerpo de la petición no válido." }, { status: 400 });
    }
    const validation = validateMessageBody(body.message);
    if (!validation.ok || !validation.body) {
      return NextResponse.json(
        { ok: false, message: validation.message ?? "Mensaje no válido." },
        { status: 400 },
      );
    }
    const message = validation.body;
    const cooldownSeconds = getMessageCooldownSeconds();
    const cooldownStart = new Date(Date.now() - cooldownSeconds * 1000);
    const recentMessage = await prisma.message.findFirst({
      where: {
        senderId: user.id,
        createdAt: { gt: cooldownStart },
      },
      orderBy: { createdAt: "desc" },
      select: { createdAt: true },
    });
    if (recentMessage) {
      const elapsed = Date.now() - recentMessage.createdAt.getTime();
      const wait = Math.max(1, Math.ceil((cooldownSeconds * 1000 - elapsed) / 1000));
      return NextResponse.json(
        { ok: false, message: `Espera ${wait}s antes de enviar otro mensaje.` },
        { status: 429 },
      );
    }

    const conversation = await prisma.conversation.upsert({
      where: {
        serviceId_clientId_professionalId: {
          serviceId: servicio.id,
          clientId: user.id,
          professionalId: servicio.profile.id,
        },
      },
      create: {
        serviceId: servicio.id,
        clientId: user.id,
        professionalId: servicio.profile.id,
        messages: {
          create: {
            senderId: user.id,
            body: message,
          },
        },
      },
      update: {
        messages: {
          create: {
            senderId: user.id,
            body: message,
          },
        },
      },
      select: {
        id: true,
      },
    });

    if (canSendMail()) {
      await sendMail({
        to: servicio.profile.email,
        subject: `Nuevo mensaje por tu servicio: ${servicio.title}`,
        text:
          `Has recibido un nuevo mensaje en CONNECTIA.\n\n` +
          `Servicio: ${servicio.title}\n` +
          `De: ${user.email}\n\n` +
          `Mensaje:\n${message}\n`,
        html: `
        <p>Has recibido un nuevo mensaje en <strong>CONNECTIA</strong>.</p>
        <p><strong>Servicio:</strong> ${servicio.title}</p>
        <p><strong>De:</strong> ${user.email}</p>
        <p><strong>Mensaje:</strong></p>
        <p style="white-space: pre-wrap">${message}</p>
      `,
      }).catch(() => {
        // El email es opcional; la conversación ya se ha guardado en la app.
      });
    }

    return NextResponse.json({ ok: true, conversationId: conversation.id });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error("contactar servicio:", e);
    return NextResponse.json(
      { ok: false, message: "No se pudo guardar el mensaje. Revisa la base de datos o inténtalo más tarde." },
      { status: 500 },
    );
  }
}
