import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Términos y condiciones — Expertysm",
  description: "Condiciones de uso de la plataforma Expertysm.",
};

export default function TerminosPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <p className="text-sm text-gray-500">
        <Link href="/" className="hover:text-[var(--connectia-gold)]">
          Inicio
        </Link>{" "}
        / Términos y condiciones
      </p>
      <h1 className="mt-4 text-3xl font-bold text-[var(--connectia-gray)]">Términos y condiciones</h1>
      <p className="mt-6 text-gray-600 leading-relaxed">
        El uso de Expertysm implica la aceptación de unas condiciones de uso que definirán el marco
        entre la plataforma, los profesionales y los clientes. Este documento legal está en
        preparación y se publicará aquí cuando esté disponible la versión revisada.
      </p>
    </main>
  );
}
