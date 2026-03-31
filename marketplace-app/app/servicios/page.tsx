import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { getPublicProfileName, truncateText } from "@/lib/publicProfile";
import ServiceCard from "@/app/servicios/_components/ServiceCard";

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

  const min = minRaw === "" ? null : Number(minRaw);
  const max = maxRaw === "" ? null : Number(maxRaw);
  const delivery = deliveryRaw === "" ? null : Number(deliveryRaw);

  const CATEGORIES = ["Arquitectura", "Legal"] as const;

  const baseWhere = {
    active: true,
    ...(category ? { category } : {}),
    ...(q
      ? {
          OR: [
            { title: { contains: q, mode: "insensitive" } },
            { description: { contains: q, mode: "insensitive" } },
            { profile: { displayName: { contains: q, mode: "insensitive" } } },
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
  } as const;

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

  const [promoted, regular] = await Promise.all([
    prisma.service.findMany({
      where: {
        ...baseWhere,
        isPromoted: true,
        promoExpiresAt: { gt: now },
      },
      orderBy: [{ promoExpiresAt: "desc" }, { createdAt: "desc" }],
      select,
    }),
    prisma.service.findMany({
      where: {
        ...baseWhere,
        OR: [{ isPromoted: false }, { promoExpiresAt: null }, { promoExpiresAt: { lte: now } }],
      },
      orderBy: [{ createdAt: "desc" }],
      select,
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

  return (
    <main className="bg-gradient-to-b from-white via-gray-50 to-gray-100">
      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-bold tracking-tight text-[var(--connectia-gray)] sm:text-4xl">
              Servicios
            </h1>
            <p className="mt-2 text-sm text-gray-600 sm:text-base">
              Encuentra servicios profesionales de <span className="font-semibold">arquitectura</span> y{" "}
              <span className="font-semibold">asesoría legal</span>. Claros, comparables y listos para contratar.
            </p>
          </div>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:items-end sm:text-right">
            <p className="text-sm leading-snug text-gray-600">
              ¿Quieres ofrecer un servicio? Publícalo aquí.
            </p>
            <Link
              href={crearServicioHref}
              className="inline-flex w-full items-center justify-center rounded-lg bg-[var(--connectia-gold)] px-5 py-2.5 text-center text-sm font-semibold text-white shadow-sm transition hover:opacity-90 sm:w-auto"
            >
              Crear nuevo servicio
            </Link>
          </div>
        </div>

        <div className="mt-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-[var(--connectia-gray)] sm:text-2xl">Categorías</h2>
            <p className="mt-1 text-sm text-gray-600">Explora rápido por tipo de servicio.</p>
          </div>
          <Link
            href="#catalogo"
            className="hidden text-sm font-semibold text-[var(--connectia-gold)] hover:underline sm:inline"
          >
            Ir al catálogo
          </Link>
        </div>

        <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
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
      <form className="mb-8 grid gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:grid-cols-12">
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
        <button
          type="submit"
          className="rounded-lg bg-[var(--connectia-gold)] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 sm:col-span-12 lg:col-span-2"
        >
          Filtrar
        </button>
      </form>

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
