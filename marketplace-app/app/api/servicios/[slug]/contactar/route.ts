import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { canSendMail, sendMail } from "@/lib/mailer";

type Params = {
  params: {
    slug: string;
  };
};

export async function POST(req: Request, { params }: Params) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ ok: false, message: "Debes iniciar sesión para contactar." }, { status: 401 });
  }

  const servicio = await prisma.service.findUnique({
    where: { slug: params.slug },
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

  const body = await req.json();
  const message = String(body.message ?? "").trim();
  if (message.length < 10 || message.length > 2000) {
    return NextResponse.json(
      { ok: false, message: "El mensaje debe tener entre 10 y 2000 caracteres." },
      { status: 400 },
    );
  }

  if (!canSendMail()) {
    return NextResponse.json(
      {
        ok: false,
        message: "Mensajería aún no configurada en servidor. Inténtalo de nuevo más tarde.",
      },
      { status: 503 },
    );
  }

  await sendMail({
    to: servicio.profile.email,
    subject: `Nuevo contacto por tu servicio: ${servicio.title}`,
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
  });

  return NextResponse.json({ ok: true });
}
