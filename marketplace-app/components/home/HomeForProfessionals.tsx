import Link from "next/link";

type Props = {
  publishHref: string;
};

export default function HomeForProfessionals({ publishHref }: Props) {
  return (
    <section className="border-b border-gray-200/80 bg-[var(--connectia-gray)] py-16 text-white sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_280px] lg:gap-16">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--connectia-gold-light)]">
              Para profesionales
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              ¿Eres arquitecto o abogado?
            </h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-gray-300">
              Publica tus servicios en Mapahub y conecta con clientes que ya buscan ayuda en{" "}
              <strong className="font-medium text-white">arquitectura</strong> o{" "}
              <strong className="font-medium text-white">legal</strong>. Gana visibilidad en un entorno
              acotado y alineado con tu especialidad.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-gray-400">
              Más adelante podrás <strong className="font-medium text-gray-200">destacar y promocionar</strong>{" "}
              tus servicios para aparecer antes en el listado cuando esa opción esté disponible.
            </p>
            <Link
              href={publishHref}
              className="mt-8 inline-flex h-12 items-center justify-center rounded-xl bg-[var(--connectia-gold)] px-8 text-sm font-semibold text-[var(--connectia-gray)] shadow-lg shadow-black/20 transition hover:brightness-110"
            >
              Publicar servicio
            </Link>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <ul className="space-y-4 text-sm text-gray-300">
              <li className="flex gap-3">
                <span className="mt-0.5 text-[var(--connectia-gold)]">✓</span>
                Fichas con precio y plazos visibles para el cliente.
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 text-[var(--connectia-gold)]">✓</span>
                Mensajería integrada para acordar el encargo.
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 text-[var(--connectia-gold)]">✓</span>
                Categorías solo Arquitectura y Legal: menos competencia irrelevante.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
