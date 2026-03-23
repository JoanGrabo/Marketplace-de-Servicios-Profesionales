import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-[calc(100vh-5rem)] bg-gradient-to-b from-white via-gray-50 to-gray-100">
      <section className="relative overflow-hidden border-b border-gray-200 bg-white">
        <div className="pointer-events-none absolute -left-20 top-0 h-64 w-64 rounded-full bg-[var(--connectia-gold)]/15 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 top-12 h-72 w-72 rounded-full bg-[var(--connectia-gold)]/10 blur-3xl" />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 sm:py-16 lg:grid-cols-2 lg:py-20">
          <div className="space-y-6">
            <p className="inline-flex rounded-full border border-[var(--connectia-gold)]/30 bg-[var(--connectia-gold)]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--connectia-gold)]">
              Marketplace profesional especializado
            </p>
            <h1 className="text-4xl font-bold tracking-tight text-[var(--connectia-gray)] sm:text-5xl">
              Encuentra al profesional ideal
              <span className="block text-[var(--connectia-gold)]">para impulsar tu proyecto.</span>
            </h1>
            <p className="max-w-xl text-sm text-gray-600 sm:text-base">
              CONNECTIA conecta clientes y profesionales en arquitectura, renders, planos y
              asesoría especializada. Compara servicios claros, contacta rápido y empieza
              con confianza.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/servicios"
                className="inline-flex items-center justify-center rounded-lg bg-[var(--connectia-gold)] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
              >
                Explorar servicios
              </Link>
              <Link
                href="/mis-servicios"
                className="inline-flex items-center justify-center rounded-lg border border-[var(--connectia-gold)] px-6 py-3 text-sm font-semibold text-[var(--connectia-gold)] transition hover:bg-[var(--connectia-gold)]/5"
              >
                Vender mis servicios
              </Link>
            </div>
            <div className="grid max-w-lg grid-cols-3 gap-3 pt-2">
              <div className="rounded-xl border border-gray-200 bg-white p-3 text-center shadow-sm">
                <p className="text-lg font-bold text-[var(--connectia-gray)]">100%</p>
                <p className="text-xs text-gray-500">online</p>
              </div>
              <div className="rounded-xl border border-gray-200 bg-white p-3 text-center shadow-sm">
                <p className="text-lg font-bold text-[var(--connectia-gray)]">24/7</p>
                <p className="text-xs text-gray-500">contacto</p>
              </div>
              <div className="rounded-xl border border-gray-200 bg-white p-3 text-center shadow-sm">
                <p className="text-lg font-bold text-[var(--connectia-gray)]">+Nicho</p>
                <p className="text-xs text-gray-500">especializado</p>
              </div>
            </div>
          </div>
          <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-widest text-[var(--connectia-gold)]">
                Servicio destacado
              </span>
              <span className="rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700">
                Activo
              </span>
            </div>
            <div className="relative mb-5 h-48 overflow-hidden rounded-2xl border border-gray-200 bg-gray-50">
              <Image
                src="/connectia-logo.png"
                alt="CONNECTIA"
                fill
                sizes="520px"
                className="object-contain p-6"
                priority
              />
            </div>
            <h2 className="text-xl font-semibold text-[var(--connectia-gray)]">
              Diseño de proyecto y documentación técnica
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Recibe propuesta profesional con entregables claros y tiempos definidos.
            </p>
            <div className="mt-4 flex items-center justify-between">
              <p className="text-xl font-bold text-[var(--connectia-gold)]">desde 120 EUR</p>
              <Link
                href="/servicios"
                className="rounded-lg border border-gray-300 px-4 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Ver catálogo
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-[var(--connectia-gray)]">
              Servicios pensados para proyectos reales
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Elige entre categorías clave para ejecutar con calidad y rapidez.
            </p>
          </div>
          <Link
            href="/servicios"
            className="hidden text-sm font-semibold text-[var(--connectia-gold)] hover:underline sm:inline"
          >
            Ver todos los servicios
          </Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <h3 className="text-sm font-semibold text-[var(--connectia-gray)]">Arquitectura</h3>
            <p className="mt-2 text-xs text-gray-600">
              Proyectos, rehabilitaciones y dirección de obra para vivienda y negocio.
            </p>
          </article>
          <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <h3 className="text-sm font-semibold text-[var(--connectia-gray)]">
              Renders y visualización
            </h3>
            <p className="mt-2 text-xs text-gray-600">
              Imágenes fotorrealistas y recorridos 3D para presentar tus ideas de forma
              profesional.
            </p>
          </article>
          <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <h3 className="text-sm font-semibold text-[var(--connectia-gray)]">
              Planos y documentación
            </h3>
            <p className="mt-2 text-xs text-gray-600">
              Planos técnicos, mediciones y documentación para trámites y licencias.
            </p>
          </article>
          <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <h3 className="text-sm font-semibold text-[var(--connectia-gray)]">
              Asesoría y servicios legales
            </h3>
            <p className="mt-2 text-xs text-gray-600">
              Consultoría especializada y, próximamente, acompañamiento legal para tus
              proyectos.
            </p>
          </article>
        </div>
      </section>

      <section className="border-y border-gray-200 bg-white/80">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 sm:grid-cols-3 sm:px-6">
          <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--connectia-gold)]">
              1. Explora
            </p>
            <h3 className="mt-2 text-lg font-semibold text-[var(--connectia-gray)]">
              Encuentra lo que necesitas
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              Filtra por nombre y precio para localizar el servicio ideal en minutos.
            </p>
          </article>
          <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--connectia-gold)]">
              2. Contacta
            </p>
            <h3 className="mt-2 text-lg font-semibold text-[var(--connectia-gray)]">
              Habla con profesionales
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              Abre conversación directa desde cada servicio y alinea alcance y plazos.
            </p>
          </article>
          <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--connectia-gold)]">
              3. Avanza
            </p>
            <h3 className="mt-2 text-lg font-semibold text-[var(--connectia-gray)]">
              Ejecuta tu proyecto
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              Trabaja con claridad desde el primer contacto y convierte ideas en resultados.
            </p>
          </article>
        </div>
      </section>

      <section className="border-t border-gray-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row">
          <div>
            <h3 className="text-base font-semibold text-[var(--connectia-gray)]">
              ¿Listo para mover tu proyecto?
            </h3>
            <p className="text-xs text-gray-600 sm:text-sm">
              Empieza hoy encontrando talento o publicando tus servicios profesionales.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/servicios"
              className="rounded-lg bg-[var(--connectia-gold)] px-5 py-2 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Empezar ahora
            </Link>
            <Link
              href="/mis-servicios"
              className="rounded-lg border border-gray-300 px-5 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              Publicar servicio
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
