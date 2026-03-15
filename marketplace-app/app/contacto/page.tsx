import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contacto — CONNECTIA",
  description: "Contacta con CONNECTIA. Consultas, colaboraciones y soporte.",
};

export default function ContactoPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <h1 className="mb-2 text-3xl font-bold text-[var(--connectia-gray)]">
        Contacto
      </h1>
      <p className="mb-10 text-gray-600">
        ¿Tienes una consulta, quieres publicar servicios o colaborar con nosotros? Escríbenos.
      </p>
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <form className="space-y-6" action="#" method="post">
          <div>
            <label htmlFor="nombre" className="mb-1 block text-sm font-medium text-gray-700">
              Nombre
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
          <div>
            <label htmlFor="asunto" className="mb-1 block text-sm font-medium text-gray-700">
              Asunto
            </label>
            <select
              id="asunto"
              name="asunto"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-[var(--connectia-gold)] focus:outline-none focus:ring-1 focus:ring-[var(--connectia-gold)]"
            >
              <option value="">Elige una opción</option>
              <option value="consulta">Consulta general</option>
              <option value="publicar">Quiero publicar servicios</option>
              <option value="contratar">Busco contratar servicios</option>
              <option value="colaborar">Colaboración / partners</option>
              <option value="otro">Otro</option>
            </select>
          </div>
          <div>
            <label htmlFor="mensaje" className="mb-1 block text-sm font-medium text-gray-700">
              Mensaje
            </label>
            <textarea
              id="mensaje"
              name="mensaje"
              rows={5}
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-[var(--connectia-gold)] focus:outline-none focus:ring-1 focus:ring-[var(--connectia-gold)]"
              placeholder="Escribe tu mensaje..."
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-[var(--connectia-gold)] px-4 py-3 font-medium text-white transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[var(--connectia-gold)] focus:ring-offset-2 sm:w-auto sm:px-8"
          >
            Enviar mensaje
          </button>
        </form>
        <p className="mt-4 text-sm text-gray-500">
          Por ahora el formulario no envía emails; lo conectaremos cuando tengamos backend. Si necesitas contactar ya, incluye tu email en el mensaje y te responderemos.
        </p>
      </div>
    </main>
  );
}
