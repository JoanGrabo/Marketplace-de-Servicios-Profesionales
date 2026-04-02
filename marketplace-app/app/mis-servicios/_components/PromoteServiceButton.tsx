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
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={start}
        disabled={loading}
        className="rounded-lg bg-[var(--connectia-cta)] px-3 py-1 text-xs font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
      >
        {loading ? "Redirigiendo..." : label}
      </button>
      <p className="text-right text-[11px] text-gray-500">Aparece primero en “Servicios”.</p>
      {error ? <p className="max-w-[260px] text-right text-[11px] text-red-600">{error}</p> : null}
    </div>
  );
}

