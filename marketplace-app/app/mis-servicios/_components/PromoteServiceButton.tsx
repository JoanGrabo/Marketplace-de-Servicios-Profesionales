"use client";

import { useState } from "react";

export default function PromoteServiceButton({ serviceId }: { serviceId: string }) {
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

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={start}
        disabled={loading}
        className="rounded-lg bg-[var(--connectia-gold)] px-3 py-1 text-xs font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
      >
        {loading ? "Redirigiendo..." : "Destacar (pago)"}
      </button>
      <p className="text-right text-[11px] text-gray-500">Aparece primero en “Servicios”.</p>
      {error ? <p className="max-w-[260px] text-right text-[11px] text-red-600">{error}</p> : null}
    </div>
  );
}

