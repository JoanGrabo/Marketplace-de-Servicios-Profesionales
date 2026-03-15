import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Quiénes somos — CONNECTIA",
  description: "Conecta, aprende y crece. CONNECTIA es el marketplace de servicios profesionales.",
};

export default function QuienesSomosPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="mb-6 text-3xl font-bold text-[var(--connectia-gray)]">
        Quiénes somos
      </h1>
      <div className="space-y-6 text-gray-600">
        <p className="text-lg leading-relaxed">
          <strong className="text-[var(--connectia-gray)]">CONNECTIA</strong> es un marketplace de servicios profesionales pensado para conectar a quienes ofrecen expertise con quienes lo necesitan.
        </p>
        <p>
          Nacimos con el foco en <strong>arquitectura, renders, planos y asesoría</strong>, y estamos ampliando hacia <strong>servicios legales</strong> y otros ámbitos profesionales. Nuestra idea es que encuentres al profesional adecuado y que los profesionales encuentren proyectos que encajen con su perfil.
        </p>
        <h2 className="mt-8 text-xl font-semibold text-[var(--connectia-gray)]">
          Conecta • Aprende • Crece
        </h2>
        <p>
          Creemos en la conexión entre personas, en el aprendizaje continuo y en el crecimiento de proyectos e ideas. Por eso nuestro lema resume lo que queremos ofrecer: un espacio donde conectar, aprender de otros y hacer crecer tu negocio o tu proyecto.
        </p>
        <p>
          Si quieres saber más o colaborar con nosotros, escríbenos desde la página de{" "}
          <Link href="/contacto" className="font-medium text-[var(--connectia-gold)] hover:underline">
            Contacto
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
