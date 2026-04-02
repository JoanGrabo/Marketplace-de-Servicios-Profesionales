import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Política de cookies — Expertysm",
  description: "Información sobre cookies en Expertysm.",
};

export default function CookiesPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <p className="text-sm text-gray-500">
        <Link href="/" className="hover:text-[var(--connectia-gold)]">
          Inicio
        </Link>{" "}
        / Cookies
      </p>
      <h1 className="mt-4 text-3xl font-bold text-[var(--connectia-gray)]">Política de cookies</h1>
      <p className="mt-6 text-gray-600 leading-relaxed">
        Expertysm utiliza cookies y tecnologías similares necesarias para el funcionamiento de la sesión
        y la seguridad del sitio. Esta página se completará con el detalle de tipos de cookies,
        finalidades y cómo gestionar tus preferencias, conforme a la normativa aplicable.
      </p>
    </main>
  );
}
