import Link from "next/link";

const AREAS = [
  {
    title: "Arquitectura",
    description:
      "Renders, planos, proyectos básicos, asesoría de diseño y todo lo que tu espacio necesita para avanzar con criterio técnico.",
    href: "/servicios?category=Arquitectura",
    accent: "from-amber-50 via-stone-50 to-white",
    bar: "bg-[var(--connectia-gold)]/50",
    icon: ArchIcon,
  },
  {
    title: "Legal",
    description:
      "Contratos, reclamaciones, asesoría jurídica y servicios legales claros y accesibles, explicados sin jerga innecesaria.",
    href: "/servicios?category=Legal",
    accent: "from-slate-50 via-sky-50/60 to-white",
    bar: "bg-sky-500/50",
    icon: ScaleIcon,
  },
];

export default function HomeAreas() {
  return (
    <section className="border-b border-gray-200/80 bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--connectia-gold)]">
            Dos áreas, un solo lugar
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[var(--connectia-gray)] sm:text-4xl">
            Especialización que se nota
          </h2>
          <p className="mt-3 text-base text-gray-600">
            Expertysm concentra talento en <strong className="font-medium text-gray-800">Arquitectura</strong> y{" "}
            <strong className="font-medium text-gray-800">Legal</strong>. Nada de listados interminables de
            categorías irrelevantes: aquí sabes qué vas a encontrar.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {AREAS.map((area) => (
            <Link
              key={area.title}
              href={area.href}
              aria-label={`Explorar ${area.title.toLowerCase()}`}
              className={`group relative block overflow-hidden rounded-3xl border border-gray-200/90 bg-gradient-to-br ${area.accent} p-8 shadow-sm ring-1 ring-black/[0.03] transition hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--connectia-gold)] focus-visible:ring-offset-2`}
            >
              <div className={`mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-md shadow-gray-900/5 ring-1 ring-gray-100`}>
                <area.icon className="h-7 w-7 text-[var(--connectia-gray)]" />
              </div>
              <div className={`mb-4 h-1 w-12 rounded-full ${area.bar}`} />
              <h3 className="text-2xl font-bold text-[var(--connectia-gray)]">{area.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-gray-600 sm:text-base">{area.description}</p>
              <span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[var(--connectia-gold)] transition group-hover:gap-3">
                Explorar {area.title.toLowerCase()}
                <span aria-hidden>→</span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function ArchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 21h18M4 21V10l8-7 8 7v11M9 21v-6h6v6"
      />
    </svg>
  );
}

function ScaleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3v18M3 12h18M5.5 5.5l13 13M18.5 5.5l-13 13"
      />
    </svg>
  );
}
