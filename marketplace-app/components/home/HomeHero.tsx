import Link from "next/link";

type Props = {
  publishHref: string;
};

export default function HomeHero({ publishHref }: Props) {
  return (
    <section className="relative overflow-hidden border-b border-gray-200/80 bg-gradient-to-b from-white via-[#faf9f7] to-[#f3f1ed]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(184,134,11,0.12),transparent)]" />
      <div className="pointer-events-none absolute -left-32 top-20 h-96 w-96 rounded-full bg-[var(--connectia-gold)]/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-[var(--connectia-gold)]/8 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-16">
          <div className="space-y-8">
            <p className="inline-flex items-center gap-2 rounded-full border border-[var(--connectia-gold)]/25 bg-white/80 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--connectia-gold)] shadow-sm backdrop-blur-sm">
              Marketplace especializado
            </p>

            <div className="space-y-4">
              <h1 className="text-[2rem] font-bold leading-[1.12] tracking-tight text-[var(--connectia-gray)] sm:text-5xl sm:leading-[1.1] lg:text-[2.75rem]">
                Encuentra arquitectos y abogados
                <span className="mt-1 block bg-gradient-to-r from-[var(--connectia-gray)] to-[var(--connectia-gold)] bg-clip-text text-transparent">
                  para tu proyecto
                </span>
              </h1>
              <p className="max-w-xl text-base leading-relaxed text-gray-600 sm:text-lg">
                Contrata servicios profesionales de{" "}
                <strong className="font-semibold text-gray-800">arquitectura</strong> y{" "}
                <strong className="font-semibold text-gray-800">asesoría legal</strong> de forma
                clara, rápida y segura. Sin ruido de categorías genéricas: solo lo que necesitas.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/servicios"
                className="inline-flex h-12 items-center justify-center rounded-xl bg-[var(--connectia-gold)] px-8 text-sm font-semibold text-white shadow-lg shadow-[var(--connectia-gold)]/25 transition hover:brightness-105"
              >
                Explorar servicios
              </Link>
              <Link
                href={publishHref}
                className="inline-flex h-12 items-center justify-center rounded-xl border-2 border-[var(--connectia-gray)]/15 bg-white px-8 text-sm font-semibold text-[var(--connectia-gray)] shadow-sm transition hover:border-[var(--connectia-gold)]/40 hover:bg-[var(--connectia-gold)]/5"
              >
                Publicar servicio
              </Link>
            </div>

            <ul className="flex flex-wrap gap-x-6 gap-y-2 border-t border-gray-200/80 pt-6 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/80">
                  <CheckIcon />
                </span>
                Profesionales especializados
              </li>
              <li className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sky-50 text-sky-700 ring-1 ring-sky-200/80">
                  <ChatIcon />
                </span>
                Contacto directo
              </li>
              <li className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-50 text-amber-800 ring-1 ring-amber-200/80">
                  <LayersIcon />
                </span>
                Solo arquitectura y legal
              </li>
            </ul>
          </div>

          <HeroVisual />
        </div>
      </div>
    </section>
  );
}

function CheckIcon() {
  return (
    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
      />
    </svg>
  );
}

function LayersIcon() {
  return (
    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 7l8-4 8 4M4 7v10l8 4 8-4V7M4 7l8 4 8-4" />
    </svg>
  );
}

function HeroVisual() {
  return (
    <div className="relative mx-auto w-full max-w-md lg:max-w-none">
      <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-[var(--connectia-gold)]/12 via-transparent to-gray-200/40 blur-2xl" />
      <div className="relative space-y-4">
        <div className="relative overflow-hidden rounded-2xl border border-gray-200/90 bg-white p-5 shadow-xl shadow-gray-900/5 ring-1 ring-black/5">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
              Vista previa
            </span>
            <span className="rounded-full bg-[var(--connectia-gold)]/12 px-2.5 py-0.5 text-[10px] font-semibold text-[var(--connectia-gold)]">
              Expertysm
            </span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-gray-100 bg-gradient-to-br from-stone-50 to-amber-50/40 p-4">
              <div className="mb-2 h-2 w-12 rounded-full bg-[var(--connectia-gold)]/40" />
              <p className="text-xs font-semibold text-[var(--connectia-gray)]">Arquitectura</p>
              <p className="mt-1 text-[11px] leading-snug text-gray-600">
                Renders, planos y asesoría de proyecto.
              </p>
            </div>
            <div className="rounded-xl border border-gray-100 bg-gradient-to-br from-slate-50 to-sky-50/40 p-4">
              <div className="mb-2 h-2 w-12 rounded-full bg-sky-400/50" />
              <p className="text-xs font-semibold text-[var(--connectia-gray)]">Legal</p>
              <p className="mt-1 text-[11px] leading-snug text-gray-600">
                Contratos y asesoría jurídica clara.
              </p>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-3 rounded-xl bg-gray-50/80 p-3 ring-1 ring-gray-100">
            <div className="h-10 w-10 shrink-0 rounded-lg bg-gradient-to-br from-[var(--connectia-gold)]/30 to-gray-200/80" />
            <div className="min-w-0 flex-1">
              <div className="h-2 w-24 rounded bg-gray-200" />
              <div className="mt-1.5 h-1.5 w-16 rounded bg-gray-100" />
            </div>
            <div className="h-8 w-14 shrink-0 rounded-lg bg-[var(--connectia-gold)]/20" />
          </div>
        </div>
        <div className="flex justify-center gap-3 pl-8">
          <div className="h-3 w-3 rounded-full bg-[var(--connectia-gold)]/40" />
          <div className="h-3 w-3 rounded-full bg-gray-200" />
          <div className="h-3 w-3 rounded-full bg-gray-200" />
        </div>
      </div>
    </div>
  );
}
