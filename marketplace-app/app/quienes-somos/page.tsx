import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Quiénes somos — Expertysm",
  description:
    "Conecta, aprende y crece. Expertysm es el marketplace de servicios profesionales para arquitectura, visualización, documentación y asesoría.",
};

export default function QuienesSomosPage() {
  return (
    <main className="bg-gradient-to-b from-white via-gray-50 to-gray-100">
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <p className="inline-flex rounded-full border border-[var(--connectia-gold)]/30 bg-[var(--connectia-gold)]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--connectia-gold)]">
            Sobre Expertysm
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight text-[var(--connectia-gray)] sm:text-5xl">
            Construimos el punto de encuentro entre talento profesional y proyectos reales.
          </h1>
          <p className="mt-4 max-w-3xl text-sm text-gray-600 sm:text-base">
            Expertysm nace para que contratar y ofrecer servicios especializados sea claro,
            rápido y confiable. Queremos reducir fricción, elevar la calidad de los
            proyectos y crear oportunidades para profesionales y clientes.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/servicios"
              className="rounded-lg bg-[var(--connectia-gold)] px-5 py-2 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Explorar servicios
            </Link>
            <Link
              href="/mis-servicios"
              className="rounded-lg border border-gray-300 px-5 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              Publicar como profesional
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid gap-5 sm:grid-cols-3">
          <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--connectia-gold)]">
              Nuestra misión
            </p>
            <p className="mt-3 text-sm leading-relaxed text-gray-600">
              Conectar clientes y profesionales de forma transparente para acelerar
              decisiones y ejecutar mejor cada proyecto.
            </p>
          </article>
          <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--connectia-gold)]">
              Nuestra visión
            </p>
            <p className="mt-3 text-sm leading-relaxed text-gray-600">
              Ser la plataforma de referencia para servicios técnicos y profesionales
              especializados en el mercado hispanohablante.
            </p>
          </article>
          <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--connectia-gold)]">
              Nuestro lema
            </p>
            <p className="mt-3 text-sm font-medium text-[var(--connectia-gray)]">
              Conecta • Aprende • Crece
            </p>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              Conecta con las personas adecuadas, aprende del proceso y haz crecer tu
              negocio o proyecto.
            </p>
          </article>
        </div>
      </section>

      <section className="border-y border-gray-200 bg-white/90">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <h2 className="text-2xl font-semibold text-[var(--connectia-gray)]">
            Qué hace diferente a Expertysm
          </h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-[var(--connectia-gray)]">
                Especialización real
              </h3>
              <p className="mt-2 text-xs text-gray-600">
                Foco inicial en arquitectura, renders, planos y asesoría con expansión
                progresiva a legal.
              </p>
            </article>
            <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-[var(--connectia-gray)]">
                Contacto directo
              </h3>
              <p className="mt-2 text-xs text-gray-600">
                Mensajería integrada para resolver dudas, definir alcance y avanzar sin
                fricción.
              </p>
            </article>
            <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-[var(--connectia-gray)]">
                Claridad en la oferta
              </h3>
              <p className="mt-2 text-xs text-gray-600">
                Servicios con información clave para comparar opciones de forma rápida.
              </p>
            </article>
            <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-[var(--connectia-gray)]">
                Evolución continua
              </h3>
              <p className="mt-2 text-xs text-gray-600">
                Mejoramos la plataforma con foco en confianza, conversión y experiencia del
                usuario.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <h2 className="text-2xl font-semibold text-[var(--connectia-gray)]">
          Cómo trabajamos
        </h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-3">
          <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--connectia-gold)]">
              Paso 1
            </p>
            <h3 className="mt-2 text-base font-semibold text-[var(--connectia-gray)]">
              Descubrir necesidades
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              Escuchamos problemas reales del mercado para priorizar funcionalidades útiles.
            </p>
          </article>
          <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--connectia-gold)]">
              Paso 2
            </p>
            <h3 className="mt-2 text-base font-semibold text-[var(--connectia-gray)]">
              Diseñar experiencia simple
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              Menos clics, mensajes claros y flujos directos para cliente y profesional.
            </p>
          </article>
          <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--connectia-gold)]">
              Paso 3
            </p>
            <h3 className="mt-2 text-base font-semibold text-[var(--connectia-gray)]">
              Medir y mejorar
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              Iteramos con datos y feedback real para aumentar confianza y resultados.
            </p>
          </article>
        </div>
      </section>

      <section className="border-t border-gray-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6">
          <div>
            <h2 className="text-lg font-semibold text-[var(--connectia-gray)]">
              ¿Quieres colaborar o saber más?
            </h2>
            <p className="text-sm text-gray-600">
              Escríbenos y cuéntanos tu proyecto o cómo te gustaría participar en Expertysm.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/contacto"
              className="rounded-lg bg-[var(--connectia-gold)] px-5 py-2 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Hablar con nosotros
            </Link>
            <Link
              href="/servicios"
              className="rounded-lg border border-gray-300 px-5 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              Ver servicios
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
