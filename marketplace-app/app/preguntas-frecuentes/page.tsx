import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Preguntas frecuentes — Expertysm",
  description: "Respuestas sobre el marketplace Expertysm: arquitectura y servicios legales.",
};

export default function PreguntasFrecuentesPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <p className="text-sm text-gray-500">
        <Link href="/" className="hover:text-[var(--connectia-gold)]">
          Inicio
        </Link>{" "}
        / Preguntas frecuentes
      </p>
      <h1 className="mt-4 text-3xl font-bold text-[var(--connectia-gray)]">Preguntas frecuentes</h1>
      <p className="mt-4 text-gray-600 leading-relaxed">
        Respuestas rápidas para usar Expertysm. Si te queda alguna duda, escríbenos en{" "}
        <Link href="/contacto" className="font-semibold text-[var(--connectia-gold)] hover:underline">
          Contacto
        </Link>
        .
      </p>

      <div className="mt-8 space-y-3">
        <FaqItem
          q="¿Es gratis registrarse?"
          a="Sí. Registrarse y explorar servicios es gratis. Publicar servicios también es gratis. La opción de “Destacar” es de pago para aumentar visibilidad."
        />
        <FaqItem
          q="¿Cómo se cobra?"
          a="Expertysm no procesa el pago del trabajo (de momento). El contacto es directo y el acuerdo se cierra entre cliente y profesional. La única transacción integrada ahora es el pago para destacar servicios."
        />
        <FaqItem
          q="¿Cómo contacto con un profesional?"
          a="Entra en un servicio y usa el botón de “Contactar”. Se abrirá una conversación para hablar del alcance, tiempos y presupuesto."
        />
        <FaqItem
          q="¿Qué tipo de proyectos hay?"
          a="Arquitectura (renders, planos, reformas, proyecto, BIM/modelado 3D) y Legal (contratos, reclamaciones, asesoría)."
        />
        <FaqItem
          q="¿Puedo publicar más de un servicio?"
          a="Sí, pero hay un límite para mantener calidad y foco. Si necesitas publicar más, puedes destacar servicios o consolidar tu oferta."
        />
        <FaqItem
          q="¿Cómo funciona “Destacar”?"
          a="Pagas una cantidad fija y tu servicio aparece primero en el catálogo durante un número de días. Puedes activar el destacado desde “Mis servicios”."
        />
        <FaqItem
          q="¿Qué pasa si no recibo respuesta?"
          a="Prueba a enviar un mensaje más concreto (objetivo, ubicación, plazos). Si sigue sin respuesta, contacta con nosotros desde la página de Contacto."
        />
      </div>
    </main>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  return (
    <details className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
        <span className="text-base font-semibold text-[var(--connectia-gray)]">{q}</span>
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-50 text-gray-600 ring-1 ring-gray-200 transition group-open:rotate-45">
          +
        </span>
      </summary>
      <p className="mt-3 text-sm leading-relaxed text-gray-600">{a}</p>
    </details>
  );
}
