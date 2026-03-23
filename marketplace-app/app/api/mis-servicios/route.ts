import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { validateServiceInput } from "@/lib/validation";

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
  const title = String(body.title ?? "");
  const description = String(body.description ?? "");
  const priceEuros = Number(body.priceEuros);
  const deliveryDays = Number(body.deliveryDays ?? 7);

  const validation = validateServiceInput({
    title,
    description,
    priceEuros,
    deliveryDays,
  });
  if (!validation.ok || !validation.data) {
    return NextResponse.json(
      { ok: false, message: validation.message ?? "Datos no válidos." },
      { status: 400 },
    );
  }
  const safe = validation.data;

  const slugBase = safe.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  const slug = `${slugBase}-${Date.now().toString(36)}`;

  await prisma.service.create({
    data: {
      profileId: user.id,
      title: safe.title,
      slug,
      description: safe.description,
      priceCents: safe.priceCents,
      deliveryDays: safe.deliveryDays,
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


