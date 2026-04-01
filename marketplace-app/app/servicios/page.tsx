import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { getPublicProfileName, truncateText } from "@/lib/publicProfile";
import ServiceCard from "@/app/servicios/_components/ServiceCard";
import { Prisma } from "@prisma/client";

export const metadata: Metadata = {
  title: "Servicios — CONNECTIA",
  description:
    "Servicios profesionales: arquitectura, renders, planos, asesoría y próximamente servicios legales.",
};

// Obliga a que la página sea dinámica y consulte la BD en cada petición
export const dynamic = "force-dynamic";

type ServiciosPageProps = {
  searchParams?: {
    q?: string;
    min?: string;
    max?: string;
    category?: string;
    delivery?: string;
    sort?: string;
    page?: string;
  };
};

export default async function ServiciosPage({ searchParams }: ServiciosPageProps) {
  const user = await getCurrentUser();
  const crearServicioHref = user
    ? "/mis-servicios"
    : `/auth/login?next=${encodeURIComponent("/mis-servicios")}`;

  const now = new Date();
  const q = String(searchParams?.q ?? "").trim();
  const minRaw = String(searchParams?.min ?? "").trim();
  const maxRaw = String(searchParams?.max ?? "").trim();
  const category = String(searchParams?.category ?? "").trim();
  const deliveryRaw = String(searchParams?.delivery ?? "").trim();
  const sort = String(searchParams?.sort ?? "").trim();
  const pageRaw = String(searchParams?.page ?? "").trim();

  const min = minRaw === "" ? null : Number(minRaw);
  const max = maxRaw === "" ? null : Number(maxRaw);
  const delivery = deliveryRaw === "" ? null : Number(deliveryRaw);
  const page = Math.max(1, Number.isFinite(Number(pageRaw)) ? Math.floor(Number(pageRaw)) : 1);
  const perPage = 18;

  const CATEGORIES = ["Arquitectura", "Legal"] as const;

  const baseWhere: Prisma.ServiceWhereInput = {
    active: true,
    ...(category ? { category } : {}),
    ...(q
      ? {
          OR: [
            { title: { contains: q, mode: Prisma.QueryMode.insensitive } },
            { description: { contains: q, mode: Prisma.QueryMode.insensitive } },
            { profile: { displayName: { contains: q, mode: Prisma.QueryMode.insensitive } } },
          ],
        }
      : {}),
    ...(typeof delivery === "number" && Number.isFinite(delivery) && delivery > 0
      ? { deliveryDays: { lte: Math.floor(delivery) } }
      : {}),
    ...(typeof min === "number" && Number.isFinite(min) && min >= 0
      ? { priceCents: { gte: Math.round(min * 100) } }
      : {}),
    ...(typeof max === "number" && Number.isFinite(max) && max > 0
      ? {
          priceCents: {
            ...(typeof min === "number" && Number.isFinite(min) && min >= 0
              ? { gte: Math.round(min * 100) }
              : {}),
            lte: Math.round(max * 100),
          },
        }
      : {}),
  };

  const select = {
    id: true,
    slug: true,
    title: true,
    description: true,
    shortDescription: true,
    category: true,
    thumbnailUrl: true,
    isPromoted: true,
    promoExpiresAt: true,
    priceCents: true,
    deliveryDays: true,
    updatedAt: true,
    profile: {
      select: { id: true, displayName: true, avatarUrl: true },
    },
  } as const;

  const regularOrderBy: Prisma.ServiceOrderByWithRelationInput[] =
    sort === "price_asc"
      ? [{ priceCents: "asc" }, { createdAt: "desc" }]
      : sort === "price_desc"
        ? [{ priceCents: "desc" }, { createdAt: "desc" }]
        : sort === "delivery_asc"
          ? [{ deliveryDays: "asc" }, { createdAt: "desc" }]
          : [{ createdAt: "desc" }];

  const [promoted, regular] = await Promise.all([
    prisma.service.findMany({
      where: {
        ...baseWhere,
        isPromoted: true,
        promoExpiresAt: { gt: now },
      },
      orderBy: [{ promoExpiresAt: "desc" }, { createdAt: "desc" }],
      select,
      take: page === 1 ? 6 : 0,
    }),
    prisma.service.findMany({
      where: {
        ...baseWhere,
        OR: [{ isPromoted: false }, { promoExpiresAt: null }, { promoExpiresAt: { lte: now } }],
      },
      orderBy: regularOrderBy,
      select,
      take: perPage,
      skip: (page - 1) * perPage,
    }),
  ]);

  const servicios = [...promoted, ...regular];

  const serviceIds = servicios.map((s) => s.id);
  const convoStats = serviceIds.length
    ? await prisma.conversation
        .groupBy({
          by: ["serviceId"],
          where: { serviceId: { in: serviceIds } },
          _count: { id: true },
        })
        .catch(() => [])
    : [];
  const conversationCountByServiceId = new Map<string, number>();
  for (const c of convoStats) {
    conversationCountByServiceId.set(c.serviceId, c._count.id ?? 0);
  }

  const filtered = servicios;

  const queryBase: Record<string, string> = {};
  if (q) queryBase.q = q;
  if (category) queryBase.category = category;
  if (deliveryRaw) queryBase.delivery = deliveryRaw;
  if (minRaw) queryBase.min = minRaw;
  if (maxRaw) queryBase.max = maxRaw;
  if (sort) queryBase.sort = sort;

  const prevHref =
    page > 1
      ? `/servicios?${new URLSearchParams({ ...queryBase, page: String(page - 1) }).toString()}`
      : null;
  const nextHref = `/servicios?${new URLSearchParams({ ...queryBase, page: String(page + 1) }).toString()}`;
  const clearHref = "/servicios";

  return (
    <main className="bg-gradient-to-b from-white via-gray-50 to-gray-100">
      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-bold tracking-tight text-[var(--connectia-gray)] sm:text-4xl">
              Servicios
            </h1>
          </div>
          <div className="flex w-full sm:w-auto sm:items-center">
            <Link
              href={crearServicioHref}
              className="inline-flex w-full items-center justify-center rounded-lg bg-[var(--connectia-gold)] px-5 py-2.5 text-center text-sm font-semibold text-white shadow-sm transition hover:opacity-90 sm:w-auto"
            >
              Crear nuevo servicio
            </Link>
          </div>
        </div>

        <div className="mt-5 flex gap-3 overflow-x-auto pb-2">
          <Link
            href="/servicios"
            className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition ${
              category === "" ? "border-[var(--connectia-gold)] bg-[var(--connectia-gold)]/10 text-[var(--connectia-gold)]" : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Todas
          </Link>
          {CATEGORIES.map((c) => (
            <Link
              key={c}
              href={`/servicios?category=${encodeURIComponent(c)}`}
              className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                category === c ? "border-[var(--connectia-gold)] bg-[var(--connectia-gold)]/10 text-[var(--connectia-gold)]" : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              {c}
            </Link>
          ))}
        </div>
      </section>

      <section id="catalogo" className="mx-auto max-w-6xl px-4 pb-12 sm:px-6">
      <form className="mb-4 grid gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:grid-cols-12">
        <input
          name="q"
          defaultValue={q}
          placeholder="Buscar por título, descripción o vendedor"
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-[var(--connectia-gold)] focus:outline-none focus:ring-1 focus:ring-[var(--connectia-gold)] sm:col-span-12 lg:col-span-4"
        />
        <select
          name="category"
          defaultValue={category}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-[var(--connectia-gold)] focus:outline-none focus:ring-1 focus:ring-[var(--connectia-gold)] sm:col-span-6 lg:col-span-2"
        >
          <option value="">Categoría</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          name="delivery"
          defaultValue={deliveryRaw}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-[var(--connectia-gold)] focus:outline-none focus:ring-1 focus:ring-[var(--connectia-gold)] sm:col-span-6 lg:col-span-2"
        >
          <option value="">Entrega</option>
          <option value="1">≤ 1 día</option>
          <option value="3">≤ 3 días</option>
          <option value="7">≤ 7 días</option>
          <option value="14">≤ 14 días</option>
          <option value="30">≤ 30 días</option>
        </select>
        <input
          name="min"
          type="number"
          min={0}
          step={1}
          defaultValue={minRaw}
          placeholder="Precio mínimo (EUR)"
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-[var(--connectia-gold)] focus:outline-none focus:ring-1 focus:ring-[var(--connectia-gold)] sm:col-span-6 lg:col-span-2"
        />
        <input
          name="max"
          type="number"
          min={0}
          step={1}
          defaultValue={maxRaw}
          placeholder="Precio máximo (EUR)"
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-[var(--connectia-gold)] focus:outline-none focus:ring-1 focus:ring-[var(--connectia-gold)] sm:col-span-6 lg:col-span-2"
        />
        <select
          name="sort"
          defaultValue={sort}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-[var(--connectia-gold)] focus:outline-none focus:ring-1 focus:ring-[var(--connectia-gold)] sm:col-span-6 lg:col-span-2"
        >
          <option value="">Orden</option>
          <option value="recent">Recientes</option>
          <option value="price_asc">Precio ↑</option>
          <option value="price_desc">Precio ↓</option>
          <option value="delivery_asc">Entrega ↑</option>
        </select>
        <input type="hidden" name="page" value="1" />
        <button
          type="submit"
          className="rounded-lg bg-[var(--connectia-gold)] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 sm:col-span-12 lg:col-span-2"
        >
          Filtrar
        </button>
      </form>

      {(q || category || deliveryRaw || minRaw || maxRaw || sort) && (
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-widest text-gray-500">Filtros:</span>
          {q ? <span className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-semibold text-gray-700">“{q}”</span> : null}
          {category ? <span className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-semibold text-gray-700">{category}</span> : null}
          {deliveryRaw ? <span className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-semibold text-gray-700">Entrega ≤ {deliveryRaw}d</span> : null}
          {minRaw ? <span className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-semibold text-gray-700">Min {minRaw}€</span> : null}
          {maxRaw ? <span className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-semibold text-gray-700">Max {maxRaw}€</span> : null}
          {sort ? <span className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-semibold text-gray-700">Orden: {sort}</span> : null}
          <Link href={clearHref} className="ml-auto text-xs font-semibold text-[var(--connectia-gold)] hover:underline">
            Limpiar
          </Link>
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="text-gray-500">
          No hemos encontrado servicios con esos filtros.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((s) => (
            <ServiceCard
              key={s.id}
              service={s}
              stats={{
                avgRating: null,
                reviewCount: 0,
                conversationCount: conversationCountByServiceId.get(s.id) ?? 0,
              }}
            />
          ))}
        </div>
      )}

      <div className="mt-10 flex items-center justify-between gap-3">
        <div className="text-sm text-gray-500">Página {page}</div>
        <div className="flex gap-2">
          {prevHref ? (
            <Link
              href={prevHref}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              Anterior
            </Link>
          ) : (
            <span className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-semibold text-gray-400">
              Anterior
            </span>
          )}
          <Link
            href={nextHref}
            className="rounded-lg bg-[var(--connectia-gold)] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Siguiente
          </Link>
        </div>
      </div>

      <p className="mt-10 text-center text-sm text-gray-500">
        ¿No encuentras lo que necesitas?{" "}
        <Link href="/contacto" className="font-semibold text-[var(--connectia-gold)] hover:underline">
          Cuéntanos tu proyecto
        </Link>
        .
      </p>
      </section>
    </main>
  );
}
