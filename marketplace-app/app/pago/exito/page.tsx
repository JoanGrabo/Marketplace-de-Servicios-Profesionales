import Link from "next/link";
import ConfirmPromotion from "./ConfirmPromotion";

type Props = {
  searchParams?: {
    session_id?: string;
  };
};

export default function PagoExitoPage({ searchParams }: Props) {
  const sessionId = String(searchParams?.session_id ?? "").trim();
  return (
    <main className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <div className="rounded-2xl border border-green-200 bg-green-50 p-6 text-green-900">
        <h1 className="text-2xl font-bold">Pago completado</h1>
        <p className="mt-2 text-sm text-green-800/90">
          Gracias. Hemos recibido la confirmación del pago.
          {sessionId ? (
            <>
              {" "}
              <span className="font-semibold">Sesión:</span> {sessionId}
            </>
          ) : null}
        </p>
        <ConfirmPromotion sessionId={sessionId} />
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href="/mis-servicios"
          className="rounded-lg bg-[var(--connectia-gold)] px-5 py-2 text-sm font-semibold text-white transition hover:opacity-90"
        >
          Ir a Mis servicios
        </Link>
        <Link
          href="/mensajes"
          className="rounded-lg border border-gray-300 px-5 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
        >
          Ir a Mensajes
        </Link>
      </div>
    </main>
  );
}

