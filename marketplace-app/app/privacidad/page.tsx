import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Política de privacidad — Mapahub",
  description: "Protección de datos en Mapahub.",
};

export default function PrivacidadPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <p className="text-sm text-gray-500">
        <Link href="/" className="hover:text-[var(--connectia-gold)]">
          Inicio
        </Link>{" "}
        / Privacidad
      </p>
      <h1 className="mt-4 text-3xl font-bold text-[var(--connectia-gray)]">Política de privacidad</h1>
      <p className="mt-6 text-gray-600 leading-relaxed">
        Mapahub tratará los datos personales conforme al Reglamento (UE) 2016/679 y la normativa
        española de protección de datos. Esta política se ampliará con el detalle de responsable,
        finalidades, legitimación, conservación y derechos de las personas interesadas.
      </p>
    </main>
  );
}
