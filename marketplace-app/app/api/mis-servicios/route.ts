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
  const category = String(body.category ?? "");
  const subcategory = String(body.subcategory ?? "");
  const shortDescription = String(body.shortDescription ?? "");
  const description = String(body.description ?? "");
  const includesText = String(body.includesText ?? "");
  const requirementsText = String(body.requirementsText ?? "");
  const thumbnailUrl = String(body.thumbnailUrl ?? "");
  const priceEuros = Number(body.priceEuros);
  const deliveryDays = Number(body.deliveryDays ?? 7);
  const fastDeliveryEnabled = Boolean(body.fastDeliveryEnabled);
  const fastDeliveryExtraEuros =
    body.fastDeliveryExtraEuros == null || body.fastDeliveryExtraEuros === ""
      ? undefined
      : Number(body.fastDeliveryExtraEuros);
  const validation = validateServiceInput({
    title,
    category,
    subcategory,
    shortDescription,
    description,
    includesText,
    requirementsText,
    thumbnailUrl,
    priceEuros,
    deliveryDays,
    fastDeliveryEnabled,
    fastDeliveryExtraEuros,
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
      category: safe.category,
      subcategory: safe.subcategory,
      shortDescription: safe.shortDescription,
      description: safe.description,
      includesText: safe.includesText,
      requirementsText: safe.requirementsText,
      thumbnailUrl: safe.thumbnailUrl,
      priceCents: safe.priceCents,
      deliveryDays: safe.deliveryDays,
      fastDeliveryEnabled: safe.fastDeliveryEnabled,
      fastDeliveryExtraCents: safe.fastDeliveryExtraCents,
      isPromoted: false,
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


