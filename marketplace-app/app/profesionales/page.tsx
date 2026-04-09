import Link from "next/link";
import { prisma } from "@/lib/db";
import { getPublicProfileName } from "@/lib/publicProfile";
import { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

async function geocodeNominatim(query: string): Promise<{ label: string; lat: number; lng: number } | null> {
  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("format", "json");
  url.searchParams.set("limit", "1");
  url.searchParams.set("q", query);

  const res = await fetch(url.toString(), {
    headers: { "User-Agent": "expertysm.com (contact: admin@expertysm.com)" },
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

type Props = {
  searchParams?: { zona?: string; tipo?: string; page?: string };
};

export default async function ProfesionalesPage({ searchParams }: Props) {
  const zona = String(searchParams?.zona ?? "").trim();
  const tipoRaw = String(searchParams?.tipo ?? "").trim().toLowerCase();
  const tipo = tipoRaw === "arquitectura" || tipoRaw === "legal" || tipoRaw === "destacados" ? tipoRaw : "";
  const radiusKm = 100;
  const pageRaw = String(searchParams?.page ?? "").trim();
  const page = Math.max(1, Number.isFinite(Number(pageRaw)) ? Math.floor(Number(pageRaw)) : 1);
  const perPage = 60;

  const geo = zona ? await geocodeNominatim(zona) : null;
  const now = new Date();

  const extraWhere =
    tipo === "arquitectura"
      ? Prisma.sql`EXISTS (SELECT 1 FROM services s WHERE s.profile_id = p.id AND s.active = true AND s.category = 'Arquitectura')`
      : tipo === "legal"
        ? Prisma.sql`EXISTS (SELECT 1 FROM services s WHERE s.profile_id = p.id AND s.active = true AND s.category = 'Legal')`
        : tipo === "destacados"
          ? Prisma.sql`EXISTS (SELECT 1 FROM services s WHERE s.profile_id = p.id AND s.active = true AND s.is_promoted = true AND s.promo_expires_at > ${now})`
          : Prisma.sql`TRUE`;

  const professionals = geo
    ? await prisma.$queryRaw<
        Array<{
          id: string;
          displayName: string | null;
          headline: string | null;
          city: string | null;
          avatarUrl: string | null;
          updatedAt: Date;
          distanceKm: number | null;
        }>
      >`
        SELECT
          p.id,
          p.display_name as "displayName",
          p.headline,
          p.city,
          p.avatar_url as "avatarUrl",
          p.updated_at as "updatedAt",
          CASE
            WHEN p.location_lat IS NULL OR p.location_lng IS NULL THEN NULL
            ELSE (
              6371 * 2 * asin(
                sqrt(
                  power(sin(radians((${geo.lat} - p.location_lat) / 2)), 2)
                  + cos(radians(p.location_lat)) * cos(radians(${geo.lat}))
                  * power(sin(radians((${geo.lng} - p.location_lng) / 2)), 2)
                )
              )
            )
          END as "distanceKm"
        FROM profiles p
        WHERE
          p.role = 'profesional'
          AND ${extraWhere}
        ORDER BY ("distanceKm" IS NULL) ASC, "distanceKm" ASC, p.updated_at DESC
        LIMIT ${perPage} OFFSET ${Math.max(0, (page - 1) * perPage)};
      `
    : await prisma.profile.findMany({
        where: {
          role: "profesional",
          ...(tipo === "arquitectura"
            ? { services: { some: { active: true, category: "Arquitectura" } } }
            : tipo === "legal"
              ? { services: { some: { active: true, category: "Legal" } } }
              : tipo === "destacados"
                ? { services: { some: { active: true, isPromoted: true, promoExpiresAt: { gt: now } } } }
                : {}),
        },
        orderBy: { updatedAt: "desc" },
        skip: Math.max(0, (page - 1) * perPage),
        take: perPage,
        select: {
          id: true,
          displayName: true,
          headline: true,
          city: true,
          avatarUrl: true,
          updatedAt: true,
        },
      });

  const nextPageHref = `/profesionales?${new URLSearchParams(
    Object.entries({
      ...(zona ? { zona } : {}),
      ...(tipo ? { tipo } : {}),
      page: String(page + 1),
    }),
  ).toString()}`;
  const prevPageHref = `/profesionales?${new URLSearchParams(
    Object.entries({
      ...(zona ? { zona } : {}),
      ...(tipo ? { tipo } : {}),
      page: String(Math.max(1, page - 1)),
    }),
  ).toString()}`;

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-3xl font-bold text-[var(--connectia-gray)]">Profesionales</h1>
          <p className="mt-2 text-gray-600">
            Busca arquitectos y abogados por zona (radio {radiusKm}km).
          </p>
        </div>
        <form className="flex w-full max-w-xl gap-2 sm:w-auto">
          {tipo ? <input type="hidden" name="tipo" value={tipo} /> : null}
          <input type="hidden" name="page" value="1" />
          <input
            name="zona"
            defaultValue={zona}
            placeholder="Ej. Barcelona, Girona, Tarragona…"
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-[var(--connectia-gold)] focus:outline-none focus:ring-1 focus:ring-[var(--connectia-gold)]"
          />
          <button
            type="submit"
            className="shrink-0 rounded-lg bg-[var(--connectia-gold)] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Buscar
          </button>
        </form>
      </div>

      {zona && !geo ? (
        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          No pude encontrar esa zona. Prueba con otra (por ejemplo “Barcelona”).
        </div>
      ) : null}

      {geo ? (
        <p className="mb-5 text-sm text-gray-600">
          Mostrando resultados cerca de <span className="font-semibold">{geo.label}</span> (ordenados por cercanía).
        </p>
      ) : null}

      {professionals.length === 0 ? (
        <p className="text-gray-500">No hay profesionales para esa zona todavía.</p>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {professionals.map((p: any) => {
            const name = getPublicProfileName(p);
            const avatarSrc =
              p.avatarUrl && p.updatedAt
                ? `${p.avatarUrl}${p.avatarUrl.includes("?") ? "&" : "?"}v=${new Date(p.updatedAt).getTime()}`
                : p.avatarUrl;
            return (
              <article key={p.id} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="flex items-start gap-3">
                  {avatarSrc ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={avatarSrc} alt="" className="h-12 w-12 rounded-full object-cover ring-1 ring-gray-200" />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-base font-semibold text-gray-500 ring-1 ring-gray-200">
                      {name.trim().slice(0, 1).toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <h2 className="truncate text-base font-semibold text-[var(--connectia-gray)]">{name}</h2>
                    {p.headline ? <p className="mt-1 line-clamp-2 text-sm text-gray-600">{p.headline}</p> : null}
                    <p className="mt-2 text-xs text-gray-500">
                      {p.city ? <span>{p.city}</span> : <span>Ciudad no indicada</span>}
                      {typeof p.distanceKm === "number" && Number.isFinite(p.distanceKm) ? (
                        <span> · a {Math.round(p.distanceKm)}km</span>
                      ) : geo ? (
                        <span> · sin ubicación</span>
                      ) : null}
                    </p>
                    <div className="mt-3">
                      <Link
                        href={`/profesionales/${encodeURIComponent(p.id)}`}
                        className="inline-flex rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                      >
                        Ver perfil →
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            );
            })}
          </div>

          <div className="mt-8 flex items-center justify-between">
            <Link
              href={prevPageHref}
              className={`rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold transition ${
                page <= 1 ? "pointer-events-none opacity-50" : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              ← Anterior
            </Link>
            <p className="text-sm text-gray-500">Página {page}</p>
            <Link
              href={nextPageHref}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              Siguiente →
            </Link>
          </div>
        </>
      )}
    </main>
  );
}

