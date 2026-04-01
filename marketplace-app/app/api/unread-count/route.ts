import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ ok: true, unreadCount: 0 });

  const unreadCount = await prisma.message
    .count({
      where: {
        readAt: null,
        senderId: { not: user.id },
        conversation: { OR: [{ clientId: user.id }, { professionalId: user.id }] },
      },
    })
    .catch(() => 0);

  return NextResponse.json({ ok: true, unreadCount });
}

