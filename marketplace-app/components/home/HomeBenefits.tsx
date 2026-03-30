const ITEMS = [
  {
    title: "Especialistas en arquitectura y legal",
    text: "Un marketplace pensado para dos disciplinas. Menos ruido, más relevancia en cada búsqueda.",
    icon: TargetIcon,
  },
  {
    title: "Servicios claros y comparables",
    text: "Precios orientativos, plazos de entrega y descripciones estructuradas para decidir con tranquilidad.",
    icon: ListIcon,
  },
  {
    title: "Contacto directo con el profesional",
    text: "Abre conversación desde cada ficha y alinea alcance y tiempos sin intermediarios opacos.",
    icon: UserIcon,
  },
  {
    title: "Plataforma simple y enfocada",
    text: "Flujo ligero: explorar, comparar y contactar. Sin funciones decorativas que distraigan del objetivo.",
    icon: SparkIcon,
  },
];

export default function HomeBenefits() {
  return (
    <section className="border-b border-gray-200/80 bg-gradient-to-b from-[#faf9f7] to-white py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--connectia-gold)]">
            Por qué Mapahub
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[var(--connectia-gray)] sm:text-4xl">
            Hecho para proyectos serios
          </h2>
          <p className="mt-3 text-base text-gray-600">
            No competimos con marketplaces gigantes de todo para todos. Mapahub es el espacio donde la
            especialización y la claridad importan.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:gap-8">
          {ITEMS.map((item) => (
            <article
              key={item.title}
              className="rounded-2xl border border-gray-200/90 bg-white p-6 shadow-sm ring-1 ring-black/[0.02] transition hover:shadow-md"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--connectia-gold)]/10 text-[var(--connectia-gold)] ring-1 ring-[var(--connectia-gold)]/15">
                <item.icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-[var(--connectia-gray)]">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function TargetIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="4" />
      <path strokeLinecap="round" d="M12 3v2M12 19v2M3 12h2M19 12h2" />
    </svg>
  );
}

function ListIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5h12M9 12h12M9 19h12M4 5h.02M4 12h.02M4 19h.02" />
    </svg>
  );
}

function UserIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );
}

function SparkIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  );
}
