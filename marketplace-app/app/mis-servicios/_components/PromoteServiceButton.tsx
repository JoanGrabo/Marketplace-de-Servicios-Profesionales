"use client";

import { useEffect, useMemo, useState } from "react";

export default function PromoteServiceButton({
  serviceId,
  offer,
  autoStart,
}: {
  serviceId: string;
  offer?: { priceCents: number; days: number };
  autoStart?: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function start() {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/promote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ serviceId }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; url?: string; message?: string };
      if (!res.ok || !data.ok || !data.url) {
        setError(data.message ?? "No se pudo iniciar el pago.");
        setLoading(false);
        return;
      }
      window.location.href = data.url;
    } catch {
      setError("No se pudo iniciar el pago.");
      setLoading(false);
    }
  }

  const label = useMemo(() => {
    if (!offer) return "Destacar (pago)";
    const price = Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(offer.priceCents / 100);
    return `Destacar ${offer.days} ${offer.days === 1 ? "día" : "días"} · ${price}`;
  }, [offer]);

  useEffect(() => {
    if (!autoStart) return;
    void start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoStart]);

  return (
    <div className="flex w-44 flex-col items-end gap-1">
      <button
        type="button"
        onClick={start}
        disabled={loading}
        className="flex h-9 w-full items-center justify-center rounded-lg bg-[var(--connectia-cta)] px-3 text-center text-xs font-semibold leading-tight text-white transition hover:opacity-90 disabled:opacity-60"
      >
        <span className="line-clamp-2">{loading ? "Redirigiendo..." : label}</span>
      </button>
      <p className="text-right text-[11px] text-gray-500">Aparece primero en “Servicios”.</p>
      {error ? <p className="max-w-[260px] text-right text-[11px] text-red-600">{error}</p> : null}
    </div>
  );
}

