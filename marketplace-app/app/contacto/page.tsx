import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contacto — Expertysm",
  description: "Contacta con Expertysm. Consultas, colaboraciones y soporte.",
};

export default function ContactoPage() {
  return (
    <main className="bg-gradient-to-b from-white via-gray-50 to-gray-100">
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <p className="inline-flex rounded-full border border-[var(--connectia-gold)]/30 bg-[var(--connectia-gold)]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--connectia-gold)]">
            Estamos para ayudarte
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight text-[var(--connectia-gray)] sm:text-5xl">
            Hablemos de tu proyecto.
          </h1>
          <p className="mt-4 max-w-3xl text-sm text-gray-600 sm:text-base">
            Si quieres publicar servicios, contratar profesionales o proponer una colaboración,
            este es el mejor punto de partida.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-1">
          <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="text-base font-semibold text-[var(--connectia-gray)]">
              Qué puedes consultar
            </h2>
            <ul className="mt-3 space-y-2 text-sm text-gray-600">
              <li>Publicar tus servicios profesionales</li>
              <li>Contratar perfiles especializados</li>
              <li>Propuestas de colaboración y partners</li>
              <li>Soporte y dudas de la plataforma</li>
            </ul>
          </article>
          <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="text-base font-semibold text-[var(--connectia-gray)]">
              Respuesta estimada
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Intentamos responder en menos de 24h laborables para consultas generales.
            </p>
          </article>
          <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="text-base font-semibold text-[var(--connectia-gray)]">
              Vía rápida
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Si quieres ver ofertas activas, entra en{" "}
              <Link href="/servicios" className="font-medium text-[var(--connectia-gold)] hover:underline">
                Servicios
              </Link>
              .
            </p>
          </article>
          <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="text-base font-semibold text-[var(--connectia-gray)]">
              Email directo
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Si necesitas respuesta inmediata, escríbenos a{" "}
              <a
                href="mailto:joangrabo@gmail.com"
                className="font-semibold text-[var(--connectia-gold)] hover:underline"
              >
                joangrabo@gmail.com
              </a>
              .
            </p>
          </article>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:col-span-2">
          <form className="space-y-5" action="#" method="post">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="nombre" className="mb-1 block text-sm font-medium text-gray-700">
                  Nombre completo
                </label>
                <input
                  id="nombre"
                  name="nombre"
                  type="text"
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-[var(--connectia-gold)] focus:outline-none focus:ring-1 focus:ring-[var(--connectia-gold)]"
                  placeholder="Tu nombre"
                />
              </div>
              <div>
                <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-[var(--connectia-gold)] focus:outline-none focus:ring-1 focus:ring-[var(--connectia-gold)]"
                  placeholder="tu@email.com"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="asunto" className="mb-1 block text-sm font-medium text-gray-700">
                  Motivo
                </label>
                <select
                  id="asunto"
                  name="asunto"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-[var(--connectia-gold)] focus:outline-none focus:ring-1 focus:ring-[var(--connectia-gold)]"
                  defaultValue=""
                >
                  <option value="" disabled>
                    Elige una opción
                  </option>
                  <option value="consulta">Consulta general</option>
                  <option value="publicar">Quiero publicar servicios</option>
                  <option value="contratar">Busco contratar servicios</option>
                  <option value="colaborar">Colaboración / partners</option>
                  <option value="soporte">Soporte técnico</option>
                </select>
              </div>
              <div>
                <label htmlFor="prioridad" className="mb-1 block text-sm font-medium text-gray-700">
                  Prioridad
                </label>
                <select
                  id="prioridad"
                  name="prioridad"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-[var(--connectia-gold)] focus:outline-none focus:ring-1 focus:ring-[var(--connectia-gold)]"
                  defaultValue="normal"
                >
                  <option value="normal">Normal</option>
                  <option value="alta">Alta</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="mensaje" className="mb-1 block text-sm font-medium text-gray-700">
                Mensaje
              </label>
              <textarea
                id="mensaje"
                name="mensaje"
                rows={6}
                required
                minLength={20}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-[var(--connectia-gold)] focus:outline-none focus:ring-1 focus:ring-[var(--connectia-gold)]"
                placeholder="Cuéntanos qué necesitas y te responderemos lo antes posible."
              />
              <p className="mt-1 text-xs text-gray-500">Incluye contexto para poder ayudarte mejor.</p>
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-[var(--connectia-gold)] px-4 py-3 font-medium text-white transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[var(--connectia-gold)] focus:ring-offset-2 sm:w-auto sm:px-8"
            >
              Enviar solicitud
            </button>
          </form>

          <p className="mt-4 text-sm text-gray-500">
            Preferimos mensajes claros y directos: objetivo, plazos y cualquier restricción (ubicación, normativa, presupuesto).
          </p>
        </div>
      </section>
    </main>
  );
}
