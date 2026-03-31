"use client";

import { useEffect, useState } from "react";

export default function ConfirmPromotion({ sessionId }: { sessionId: string }) {
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      if (!sessionId) return;
      setStatus("loading");
      setMessage(null);
      try {
        const res = await fetch("/api/stripe/confirm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ sessionId }),
        });
        const data = (await res.json().catch(() => ({}))) as { ok?: boolean; message?: string };
        if (cancelled) return;
        if (!res.ok || !data.ok) {
          setStatus("error");
          setMessage(data.message ?? "No se pudo confirmar el pago.");
          return;
        }
        setStatus("ok");
      } catch {
        if (cancelled) return;
        setStatus("error");
        setMessage("No se pudo confirmar el pago.");
      }
    }
    void run();
    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  if (!sessionId) return null;
  if (status === "loading") {
    return <p className="mt-3 text-sm text-green-800/90">Confirmando el pago…</p>;
  }
  if (status === "ok") {
    return <p className="mt-3 text-sm text-green-800/90">Destacado aplicado. Ya puedes volver a “Mis servicios”.</p>;
  }
  if (status === "error") {
    return (
      <p className="mt-3 text-sm text-amber-800/90">
        Pago recibido, pero no pudimos aplicar el destacado automáticamente.{" "}
        <span className="font-medium">Vuelve a “Mis servicios”</span> y refresca; si sigue igual, revisa el webhook.{" "}
        {message ? <span className="block text-[12px] text-amber-800/80">{message}</span> : null}
      </p>
    );
  }
  return null;
}

