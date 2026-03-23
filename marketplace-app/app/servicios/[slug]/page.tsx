import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";

type ServicioDetalleProps = {
  params: {
    slug: string;
  };
};

export const dynamic = "force-dynamic";

export default async function ServicioDetallePage({ params }: ServicioDetalleProps) {
  const servicio = await prisma.service.findUnique({
    where: { slug: params.slug },
    include: { profile: true },
  });

  if (!servicio || !servicio.active) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <p className="mb-5 text-sm text-gray-500">
        <Link href="/servicios" className="hover:underline">
          Servicios
        </Link>{" "}
        / {servicio.title}
      </p>
      <article className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-bold text-[var(--connectia-gray)]">{servicio.title}</h1>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-y border-gray-100 py-4">
          <div className="text-sm text-gray-600">
            <div className="font-medium text-gray-700">Profesional</div>
            <div>{servicio.profile.email}</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-500">Precio</div>
            <div className="text-2xl font-bold text-[var(--connectia-gold)]">
              {Intl.NumberFormat("es-ES", {
                style: "currency",
                currency: "EUR",
                maximumFractionDigits: 0,
              }).format(servicio.priceCents / 100)}
            </div>
          </div>
        </div>
        <section className="mt-5 space-y-5">
          <div>
            <h2 className="text-base font-semibold text-[var(--connectia-gray)]">Descripción</h2>
            <p className="mt-2 whitespace-pre-wrap text-gray-700">
              {servicio.description?.trim() || "El profesional no ha añadido una descripción."}
            </p>
          </div>
          <div className="text-sm text-gray-600">
            Entrega estimada:{" "}
            <span className="font-medium text-gray-800">
              {servicio.deliveryDays} {servicio.deliveryDays === 1 ? "día" : "días"}
            </span>
          </div>
        </section>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/contacto"
            className="rounded-lg bg-[var(--connectia-gold)] px-5 py-2 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Contactar para contratar
          </Link>
          <Link
            href="/servicios"
            className="rounded-lg border border-gray-300 px-5 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            Ver más servicios
          </Link>
        </div>
      </article>
    </main>
  );
}
