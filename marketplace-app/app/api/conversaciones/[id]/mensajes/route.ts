import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { getMessageCooldownSeconds, validateMessageBody } from "@/lib/validation";

type Params = {
  params: {
    id: string;
  };
};

export async function POST(req: Request, { params }: Params) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ ok: false, message: "No autenticado." }, { status: 401 });
  }

  const conversation = await prisma.conversation.findUnique({
    where: { id: params.id },
    select: {
      id: true,
      clientId: true,
      professionalId: true,
    },
  });

  if (!conversation) {
    return NextResponse.json({ ok: false, message: "Conversación no encontrada." }, { status: 404 });
  }

  const canAccess = conversation.clientId === user.id || conversation.professionalId === user.id;
  if (!canAccess) {
    return NextResponse.json({ ok: false, message: "No autorizado." }, { status: 403 });
  }

  const body = await req.json();
  const validation = validateMessageBody(body.message);
  if (!validation.ok || !validation.body) {
    return NextResponse.json(
      { ok: false, message: validation.message ?? "Mensaje no válido." },
      { status: 400 },
    );
  }

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

  await prisma.message.create({
    data: {
      conversationId: conversation.id,
      senderId: user.id,
      body: validation.body,
    },
  });

  return NextResponse.json({ ok: true });
}
