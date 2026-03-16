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

export default async function ServiciosPage() {
  const servicios = await prisma.service.findMany({
    where: { active: true },
    orderBy: { createdAt: "desc" },
    include: { profile: true },
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
                  {s.title}
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
                  <div>
                    {s.profile.displayName || s.profile.email}
                  </div>
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
