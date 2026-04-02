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
      <p className="mt-6 text-gray-600 leading-relaxed">
        Estamos preparando esta sección con respuestas claras sobre cómo usar Expertysm, publicar
        servicios y contactar con profesionales de arquitectura y legal. Si necesitas ayuda
        mientras tanto, puedes escribirnos desde{" "}
        <Link href="/contacto" className="font-medium text-[var(--connectia-gold)] hover:underline">
          Contacto
        </Link>
        .
      </p>
    </main>
  );
}
