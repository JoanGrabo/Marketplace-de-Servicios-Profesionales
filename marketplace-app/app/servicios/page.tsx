import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";

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
  };
};

export default async function ServiciosPage({ searchParams }: ServiciosPageProps) {
  const q = String(searchParams?.q ?? "").trim();
  const minRaw = String(searchParams?.min ?? "").trim();
  const maxRaw = String(searchParams?.max ?? "").trim();
  const min = minRaw === "" ? null : Number(minRaw);
  const max = maxRaw === "" ? null : Number(maxRaw);

  const servicios = await prisma.service.findMany({
    where: {
      active: true,
      ...(q
        ? {
            OR: [
              { title: { contains: q, mode: "insensitive" } },
              { description: { contains: q, mode: "insensitive" } },
              { profile: { email: { contains: q, mode: "insensitive" } } },
            ],
          }
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
    },
    orderBy: { createdAt: "desc" },
    include: {
      profile: {
        select: {
          email: true,
        },
      },
    },
  });

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="mb-2 text-3xl font-bold text-[var(--connectia-gray)]">
        Servicios
      </h1>
      <p className="mb-10 text-gray-600">
        Conectamos profesionales con clientes. Estos son los servicios que ya están
        disponibles en CONNECTIA.
      </p>
      <form className="mb-8 grid gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:grid-cols-3">
        <input
          name="q"
          defaultValue={q}
          placeholder="Buscar por título, descripción o autor"
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-[var(--connectia-gold)] focus:outline-none focus:ring-1 focus:ring-[var(--connectia-gold)] sm:col-span-3"
        />
        <input
          name="min"
          type="number"
          min={0}
          step={1}
          defaultValue={minRaw}
          placeholder="Precio mínimo (EUR)"
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-[var(--connectia-gold)] focus:outline-none focus:ring-1 focus:ring-[var(--connectia-gold)]"
        />
        <input
          name="max"
          type="number"
          min={0}
          step={1}
          defaultValue={maxRaw}
          placeholder="Precio máximo (EUR)"
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-[var(--connectia-gold)] focus:outline-none focus:ring-1 focus:ring-[var(--connectia-gold)]"
        />
        <button
          type="submit"
          className="rounded-lg bg-[var(--connectia-gold)] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
        >
          Filtrar
        </button>
      </form>

      {servicios.length === 0 ? (
        <p className="text-gray-500">
          Aún no hay servicios publicados. Pronto verás aquí el catálogo inicial.
        </p>
      ) : (
        <ul className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
          {servicios.map((s) => (
            <li
              key={s.id}
              className="flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md"
            >
              <div>
                <h2 className="text-xl font-semibold text-[var(--connectia-gray)]">
                  <Link href={`/servicios/${s.slug}`} className="hover:underline">
                    {s.title}
                  </Link>
                </h2>
                {s.description && (
                  <p className="mt-2 text-gray-600 line-clamp-4">{s.description}</p>
                )}
              </div>
              <div className="mt-4 flex items-center justify-between text-sm">
                <div className="font-semibold text-[var(--connectia-gold)]">
                  {Intl.NumberFormat("es-ES", {
                    style: "currency",
                    currency: "EUR",
                    maximumFractionDigits: 0,
                  }).format(s.priceCents / 100)}
                </div>
                <div className="text-right text-xs text-gray-500">
                  <div>{s.profile.email}</div>
                  <div>
                    Entrega estimada: {s.deliveryDays}{" "}
                    {s.deliveryDays === 1 ? "día" : "días"}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <p className="mt-10 text-center text-gray-500">
        ¿Quieres publicar o contratar un servicio?{" "}
        <Link
          href="/contacto"
          className="font-medium text-[var(--connectia-gold)] hover:underline"
        >
          Contacta con nosotros
        </Link>
      </p>
    </main>
  );
}
