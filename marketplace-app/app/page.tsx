import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-[calc(100vh-5rem)] bg-gradient-to-b from-white via-gray-50 to-gray-100">
      {/* Hero */}
      <section className="border-b border-gray-200 bg-white/80">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-10 px-4 py-12 sm:flex-row sm:py-16 lg:py-20">
          <div className="flex-1 space-y-6 text-center sm:text-left">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--connectia-gold)]">
              Marketplace de servicios profesionales
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-[var(--connectia-gray)] sm:text-4xl lg:text-5xl">
              Conecta con profesionales
              <br />
              de arquitectura y legal en un solo lugar.
            </h1>
            <p className="max-w-xl text-sm text-gray-600 sm:text-base">
              CONNECTIA reúne arquitectos, especialistas en renders, técnicos, asesores y,
              muy pronto, profesionales legales. Publica tus servicios o encuentra justo
              lo que tu proyecto necesita.
            </p>
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-start">
              <Link
                href="/servicios"
                className="inline-flex items-center justify-center rounded-lg bg-[var(--connectia-gold)] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
              >
                Ver servicios disponibles
              </Link>
              <Link
                href="/mis-servicios"
                className="inline-flex items-center justify-center rounded-lg border border-[var(--connectia-gold)] px-6 py-3 text-sm font-semibold text-[var(--connectia-gold)] transition hover:bg-[var(--connectia-gold)]/5"
              >
                Publicar mis servicios
              </Link>
            </div>
            <p className="text-xs text-gray-500">
              — CONECTA • APRENDE • CRECE —
            </p>
          </div>
          <div className="flex-1">
            <div className="relative mx-auto h-52 w-52 overflow-hidden rounded-3xl border border-gray-200 bg-gray-50 shadow-lg sm:h-64 sm:w-64">
              <Image
                src="/connectia-logo.png"
                alt="CONNECTIA"
                fill
                sizes="256px"
                className="object-contain p-6"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Sección de categorías */}
      <section className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
        <h2 className="mb-6 text-center text-2xl font-semibold text-[var(--connectia-gray)]">
          ¿Qué puedes encontrar en CONNECTIA?
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-[var(--connectia-gray)]">
              Arquitectura
            </h3>
            <p className="mt-2 text-xs text-gray-600">
              Proyectos, licencias, rehabilitaciones y dirección de obra para tu vivienda
              o negocio.
            </p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-[var(--connectia-gray)]">
              Renders y visualización
            </h3>
            <p className="mt-2 text-xs text-gray-600">
              Imágenes fotorrealistas y recorridos 3D para presentar tus ideas de forma
              profesional.
            </p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-[var(--connectia-gray)]">
              Planos y documentación
            </h3>
            <p className="mt-2 text-xs text-gray-600">
              Planos técnicos, mediciones y documentación para trámites y licencias.
            </p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-[var(--connectia-gray)]">
              Asesoría y servicios legales
            </h3>
            <p className="mt-2 text-xs text-gray-600">
              Consultoría especializada y, próximamente, acompañamiento legal para tus
              proyectos.
            </p>
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="border-t border-gray-200 bg-white/80">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row">
          <div>
            <h3 className="text-base font-semibold text-[var(--connectia-gray)]">
              ¿Listo para dar el siguiente paso?
            </h3>
            <p className="text-xs text-gray-600 sm:text-sm">
              Empieza encontrando el servicio perfecto o publicando el tuyo hoy mismo.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/servicios"
              className="rounded-lg bg-[var(--connectia-gold)] px-5 py-2 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Ver servicios
            </Link>
            <Link
              href="/contacto"
              className="rounded-lg border border-gray-300 px-5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Hablar con nosotros
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
