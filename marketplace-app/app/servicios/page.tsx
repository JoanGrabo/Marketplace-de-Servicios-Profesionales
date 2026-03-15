import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Servicios — CONNECTIA",
  description: "Servicios profesionales: arquitectura, renders, planos, asesoría y próximamente servicios legales.",
};

const servicios = [
  {
    titulo: "Arquitectura",
    descripcion: "Diseño y dirección de proyectos arquitectónicos, reformas y certificaciones.",
    icono: "🏛️",
  },
  {
    titulo: "Renders y visualización",
    descripcion: "Imágenes fotorrealistas y recorridos virtuales para presentar tu proyecto.",
    icono: "🖼️",
  },
  {
    titulo: "Planos y documentación",
    descripcion: "Planos técnicos, mediciones y documentación para licencias y obra.",
    icono: "📐",
  },
  {
    titulo: "Asesoría",
    descripcion: "Consultoría en diseño, normativa y viabilidad de proyectos.",
    icono: "💡",
  },
  {
    titulo: "Servicios legales",
    descripcion: "Próximamente: asesoría legal vinculada a proyectos y propiedad.",
    icono: "⚖️",
    proximamente: true,
  },
];

export default function ServiciosPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="mb-2 text-3xl font-bold text-[var(--connectia-gray)]">
        Servicios
      </h1>
      <p className="mb-10 text-gray-600">
        Conectamos profesionales con clientes. Estos son los tipos de servicio que podrás encontrar en CONNECTIA.
      </p>
      <ul className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
        {servicios.map((s) => (
          <li
            key={s.titulo}
            className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md"
          >
            <span className="text-2xl" aria-hidden>{s.icono}</span>
            <h2 className="mt-2 text-xl font-semibold text-[var(--connectia-gray)]">
              {s.titulo}
              {s.proximamente && (
                <span className="ml-2 text-sm font-normal text-[var(--connectia-gold)]">
                  (próximamente)
                </span>
              )}
            </h2>
            <p className="mt-2 text-gray-600">{s.descripcion}</p>
          </li>
        ))}
      </ul>
      <p className="mt-10 text-center text-gray-500">
        ¿Quieres publicar o contratar un servicio?{" "}
        <Link href="/contacto" className="font-medium text-[var(--connectia-gold)] hover:underline">
          Contacta con nosotros
        </Link>
      </p>
    </main>
  );
}
