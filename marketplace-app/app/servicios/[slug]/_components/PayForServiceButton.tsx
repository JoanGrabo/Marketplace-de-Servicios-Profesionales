"use client";

import { useState } from "react";

export default function PayForServiceButton({ serviceSlug }: { serviceSlug: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function startCheckout() {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ serviceSlug }),
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
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={startCheckout}
        disabled={loading}
        className="rounded-lg bg-[var(--connectia-gold)] px-5 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
      >
        {loading ? "Redirigiendo..." : "Pagar con tarjeta"}
      </button>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  );
}

