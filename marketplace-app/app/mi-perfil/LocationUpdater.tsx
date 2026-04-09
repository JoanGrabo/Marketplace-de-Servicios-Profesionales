"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LocationUpdater({
  initialLocationLabel,
}: {
  initialLocationLabel: string;
}) {
  const router = useRouter();
  const [value, setValue] = useState(initialLocationLabel);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function onSave() {
    const location = value.trim();
    if (!location) {
      setMessage("Escribe una zona (ej. Barcelona, Sabadell…).");
      return;
    }
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/profile/location", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ location }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; message?: string; locationLabel?: string };
      if (!res.ok || !data.ok) {
        setMessage(data.message ?? "No se pudo guardar la ubicación.");
        setSaving(false);
        return;
      }
      if (data.locationLabel) setValue(data.locationLabel);
      setSaving(false);
      router.refresh();
    } catch {
      setMessage("Error inesperado al guardar la ubicación.");
      setSaving(false);
    }
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50/40 p-4">
      <p className="text-sm font-semibold text-[var(--connectia-gray)]">Zona (para búsquedas por radio)</p>
      <p className="mt-1 text-xs text-gray-600">
        Los clientes podrán encontrarte por zona dentro de un radio de ~100km.
      </p>
      <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-[var(--connectia-gold)] focus:outline-none focus:ring-1 focus:ring-[var(--connectia-gold)]"
          placeholder="Ej. Barcelona, Girona, Terrassa…"
        />
        <button
          type="button"
          onClick={() => void onSave()}
          disabled={saving}
          className="shrink-0 rounded-lg bg-[var(--connectia-gold)] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
        >
          {saving ? "Guardando..." : "Guardar zona"}
        </button>
      </div>
      {message ? <p className="mt-2 text-xs text-amber-800">{message}</p> : null}
    </div>
  );
}

