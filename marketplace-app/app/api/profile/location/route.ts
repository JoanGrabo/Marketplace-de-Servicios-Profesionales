import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

type Body = {
  location?: unknown;
};

async function geocodeNominatim(query: string): Promise<{ label: string; lat: number; lng: number } | null> {
  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("format", "json");
  url.searchParams.set("limit", "1");
  url.searchParams.set("q", query);

  const res = await fetch(url.toString(), {
    headers: {
      // Nominatim requiere un User-Agent identificable
      "User-Agent": "expertysm.com (contact: admin@expertysm.com)",
    },
    cache: "no-store",
  });

  if (!res.ok) return null;
  const data = (await res.json().catch(() => null)) as any[] | null;
  const first = Array.isArray(data) ? data[0] : null;
  if (!first) return null;
  const lat = Number(first.lat);
  const lng = Number(first.lon);
  const label = String(first.display_name ?? query);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  return { label, lat, lng };
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ ok: false, message: "No autenticado." }, { status: 401 });

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ ok: false, message: "Cuerpo no válido." }, { status: 400 });
  }

  const location = String(body.location ?? "").trim();
  if (!location) {
    return NextResponse.json({ ok: false, message: "Indica una zona (ej. 'Barcelona' o 'Sabadell')." }, { status: 400 });
  }

  const geo = await geocodeNominatim(location);
  if (!geo) {
    return NextResponse.json({ ok: false, message: "No se pudo encontrar esa zona. Prueba con otra." }, { status: 404 });
  }

  await prisma.profile.update({
    where: { id: user.id },
    data: {
      locationLabel: geo.label,
      locationLat: geo.lat,
      locationLng: geo.lng,
    },
  });

  return NextResponse.json({ ok: true, locationLabel: geo.label, lat: geo.lat, lng: geo.lng });
}

