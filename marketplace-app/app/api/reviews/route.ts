import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

type Body = {
  conversationId?: unknown;
  rating?: unknown;
  comment?: unknown;
};

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ ok: false, message: "No autenticado." }, { status: 401 });

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ ok: false, message: "Cuerpo no válido." }, { status: 400 });
  }

  const conversationId = String(body.conversationId ?? "").trim();
  const ratingNum = Number(body.rating);
  const rating = Number.isFinite(ratingNum) ? Math.floor(ratingNum) : NaN;
  const comment = String(body.comment ?? "").trim();

  if (!conversationId) {
    return NextResponse.json({ ok: false, message: "Falta la conversación." }, { status: 400 });
  }
  if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
    return NextResponse.json({ ok: false, message: "La puntuación debe ser de 1 a 5." }, { status: 400 });
  }
  if (comment.length > 600) {
    return NextResponse.json({ ok: false, message: "El comentario es demasiado largo (máx 600 caracteres)." }, { status: 400 });
  }

  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    select: {
      id: true,
      clientId: true,
      professionalId: true,
      serviceId: true,
    },
  });
  if (!conversation) {
    return NextResponse.json({ ok: false, message: "Conversación no encontrada." }, { status: 404 });
  }

  // MVP: solo el cliente puede valorar al profesional.
  if (conversation.clientId !== user.id) {
    return NextResponse.json({ ok: false, message: "Solo el cliente puede valorar esta conversación." }, { status: 403 });
  }

  const existing = await prisma.review.findUnique({
    where: { conversationId: conversation.id },
    select: { id: true },
  });
  if (existing) {
    return NextResponse.json({ ok: false, message: "Ya has valorado esta conversación." }, { status: 409 });
  }

  const created = await prisma.review.create({
    data: {
      conversationId: conversation.id,
      serviceId: conversation.serviceId,
      buyerId: conversation.clientId,
      sellerId: conversation.professionalId,
      rating,
      comment: comment || null,
    },
    select: { id: true },
  });

  return NextResponse.json({ ok: true, reviewId: created.id });
}

