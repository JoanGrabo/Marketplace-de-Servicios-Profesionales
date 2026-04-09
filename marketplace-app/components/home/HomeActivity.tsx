import Link from "next/link";

type Props = {
  stats: {
    newServices7d: number;
    conversations7d: number;
    featuredCount: number;
  };
  publishHref: string;
};

export default function HomeActivity({ stats, publishHref }: Props) {
  const newServices = Math.max(0, Math.floor(stats.newServices7d));
  const convos = Math.max(0, Math.floor(stats.conversations7d));
  const featured = Math.max(0, Math.floor(stats.featuredCount));

  return (
    <section className="border-b border-gray-200/80 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--connectia-gold)]">
              Actividad reciente
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-[var(--connectia-gray)] sm:text-3xl">
              Esto se está moviendo ahora
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-gray-600 sm:text-base">
              Nuevos servicios y conversaciones en la plataforma. Entra, filtra y contacta directo.
            </p>
          </div>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
            <Link
              href="/servicios?featured=1"
              className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-[var(--connectia-gold)] px-6 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 sm:w-auto"
            >
              Ver destacados ⭐
            </Link>
            <Link
              href={publishHref}
              className="inline-flex h-11 w-full items-center justify-center rounded-xl border border-gray-200 bg-white px-6 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 sm:w-auto"
            >
              Publica en 3 minutos
            </Link>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <StatCard label="Servicios nuevos (7 días)" value={newServices} />
          <StatCard label="Conversaciones iniciadas (7 días)" value={convos} />
          <StatCard label="Servicios destacados activos" value={featured} />
        </div>
      </div>
    </section>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-gradient-to-b from-white to-gray-50 p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">{label}</p>
      <div className="mt-2 text-3xl font-bold tracking-tight text-[var(--connectia-gray)]">{value}</div>
    </div>
  );
}

