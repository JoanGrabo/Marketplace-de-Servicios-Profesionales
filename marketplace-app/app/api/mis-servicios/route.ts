import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ ok: false, message: "No autenticado" }, { status: 401 });
  }

  const services = await prisma.service.findMany({
    where: { profileId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ ok: true, services });
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ ok: false, message: "No autenticado" }, { status: 401 });
  }

  const body = await req.json();
  const title = (body.title as string | undefined)?.trim();
  const description = (body.description as string | undefined)?.trim();
  const priceEuros = Number(body.priceEuros);
  const deliveryDays = Number(body.deliveryDays ?? 7);

  if (!title || !priceEuros || isNaN(priceEuros)) {
    return NextResponse.json(
      { ok: false, message: "Título y precio son obligatorios." },
      { status: 400 },
    );
  }

  const slugBase = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const slug = `${slugBase}-${Date.now().toString(36)}`;

  await prisma.service.create({
    data: {
      profileId: user.id,
      title,
      slug,
      description,
      priceCents: Math.round(priceEuros * 100),
      deliveryDays: isNaN(deliveryDays) ? 7 : deliveryDays,
      active: true,
    },
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ ok: false, message: "No autenticado" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ ok: false, message: "Falta id" }, { status: 400 });
  }

  // Solo permite borrar servicios del propio usuario
  await prisma.service.deleteMany({
    where: {
      id,
      profileId: user.id,
    },
  });

  return NextResponse.json({ ok: true });
}


