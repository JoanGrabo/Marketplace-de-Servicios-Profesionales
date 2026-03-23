"use client";

import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-start justify-center px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold text-[var(--connectia-gray)]">Algo ha fallado</h1>
      <p className="mt-3 text-gray-600">
        Ha ocurrido un error interno. Puedes reintentar o volver al inicio.
      </p>
      {error.digest && (
        <p className="mt-2 text-xs text-gray-500">Código de error: {error.digest}</p>
      )}
      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-lg bg-[var(--connectia-gold)] px-5 py-2 text-sm font-semibold text-white transition hover:opacity-90"
        >
          Reintentar
        </button>
        <Link
          href="/"
          className="rounded-lg border border-gray-300 px-5 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
        >
          Ir al inicio
        </Link>
      </div>
    </main>
  );
}
