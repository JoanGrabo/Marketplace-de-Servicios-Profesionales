import Link from "next/link";
import ServiceCard from "@/app/servicios/_components/ServiceCard";
import type { HomeFeaturedItem } from "@/lib/homeData";

type Props = {
  items: HomeFeaturedItem[];
};

export default function HomeFeatured({ items }: Props) {
  const hasReal = items.length > 0;

  return (
    <section className="border-b border-gray-200/80 bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--connectia-gold)]">
              Catálogo
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-[var(--connectia-gray)] sm:text-4xl">
              Servicios destacados
            </h2>
            <p className="mt-2 max-w-xl text-base text-gray-600">
              Una muestra de lo que publican profesionales en Mapahub.{" "}
              {hasReal
                ? "Actualizado con servicios reales de la plataforma."
                : "Cuando haya servicios activos, aparecerán aquí automáticamente."}
            </p>
          </div>
          <Link
            href="/servicios"
            className="inline-flex items-center text-sm font-semibold text-[var(--connectia-gold)] transition hover:underline"
          >
            Ver todos los servicios →
          </Link>
        </div>

        {hasReal ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map(({ service, stats }) => (
              <ServiceCard key={service.id} service={service} stats={stats} showMessageButton={false} />
            ))}
          </div>
        ) : (
          <FeaturedPlaceholders />
        )}
      </div>
    </section>
  );
}

function FeaturedPlaceholders() {
  const mocks = [
    {
      title: "Render interior fotorrealista de vivienda",
      category: "Arquitectura",
      price: "desde 180 €",
      days: "7 días",
      pro: "Estudio ejemplo",
      promoted: true,
      gradient: "from-amber-100/80 to-stone-100/60",
    },
    {
      title: "Revisión de contrato de alquiler",
      category: "Legal",
      price: "desde 95 €",
      days: "5 días",
      pro: "Asesoría ejemplo",
      promoted: false,
      gradient: "from-slate-100/90 to-sky-50/80",
    },
    {
      title: "Plano básico y asesoría de reforma",
      category: "Arquitectura",
      price: "desde 220 €",
      days: "10 días",
      pro: "Arquitecto ejemplo",
      promoted: false,
      gradient: "from-neutral-100 to-amber-50/70",
    },
  ];

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {mocks.map((m) => (
        <article
          key={m.title}
          className="overflow-hidden rounded-2xl border border-dashed border-gray-200/90 bg-gray-50/50 shadow-sm"
        >
          <div className={`relative aspect-[16/10] w-full bg-gradient-to-br ${m.gradient}`}>
            <div className="absolute inset-0 flex items-center justify-center p-6">
              <span className="rounded-lg border border-white/60 bg-white/40 px-3 py-1.5 text-[11px] font-semibold text-gray-600 backdrop-blur-sm">
                Vista de ejemplo
              </span>
            </div>
            {m.promoted && (
              <div className="absolute left-3 top-3">
                <span className="rounded-full bg-[var(--connectia-gold)]/15 px-2 py-1 text-[11px] font-semibold text-[var(--connectia-gold)] ring-1 ring-[var(--connectia-gold)]/20">
                  Destacado
                </span>
              </div>
            )}
          </div>
          <div className="space-y-3 border-t border-gray-100 bg-white p-4">
            <div className="flex items-start justify-between gap-2">
              <h3 className="line-clamp-2 text-base font-semibold text-[var(--connectia-gray)]">{m.title}</h3>
              <div className="shrink-0 text-right">
                <p className="text-[10px] uppercase tracking-wide text-gray-400">Desde</p>
                <p className="text-sm font-bold text-[var(--connectia-gold)]">{m.price}</p>
              </div>
            </div>
            <span className="inline-flex rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-[11px] font-semibold text-gray-700">
              {m.category}
            </span>
            <div className="flex items-center justify-between gap-2 border-t border-gray-50 pt-2 text-xs text-gray-600">
              <span className="font-medium text-gray-800">{m.pro}</span>
              <span className="text-gray-500">Entrega · {m.days}</span>
            </div>
            <Link
              href="/servicios"
              className="flex w-full items-center justify-center rounded-lg bg-[var(--connectia-gold)] py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Ver servicio
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}
