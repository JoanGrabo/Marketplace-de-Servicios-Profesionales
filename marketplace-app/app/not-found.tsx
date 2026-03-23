import Link from "next/link";

export default function NotFoundPage() {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-start justify-center px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold text-[var(--connectia-gray)]">Página no encontrada</h1>
      <p className="mt-3 text-gray-600">
        La página que buscas no existe o ha sido movida.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-lg bg-[var(--connectia-gold)] px-5 py-2 text-sm font-semibold text-white transition hover:opacity-90"
      >
        Volver al inicio
      </Link>
    </main>
  );
}
