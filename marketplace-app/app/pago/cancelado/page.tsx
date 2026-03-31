import Link from "next/link";

type Props = {
  searchParams?: {
    order_id?: string;
  };
};

export default function PagoCanceladoPage({ searchParams }: Props) {
  const orderId = String(searchParams?.order_id ?? "").trim();
  return (
    <main className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-900">
        <h1 className="text-2xl font-bold">Pago cancelado</h1>
        <p className="mt-2 text-sm text-amber-800/90">
          No se ha realizado ningún cargo.
          {orderId ? (
            <>
              {" "}
              <span className="font-semibold">Pedido:</span> {orderId}
            </>
          ) : null}
        </p>
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href="/servicios"
          className="rounded-lg bg-[var(--connectia-gold)] px-5 py-2 text-sm font-semibold text-white transition hover:opacity-90"
        >
          Volver a servicios
        </Link>
        <Link
          href="/contacto"
          className="rounded-lg border border-gray-300 px-5 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
        >
          ¿Problemas? Contáctanos
        </Link>
      </div>
    </main>
  );
}

