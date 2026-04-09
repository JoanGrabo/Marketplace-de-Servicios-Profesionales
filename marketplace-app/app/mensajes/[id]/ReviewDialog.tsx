"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

function Star({ filled }: { filled: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 17.3 6.8 20l1-5.9L3.6 9.9l5.9-.9L12 3.6l2.5 5.4 5.9.9-4.2 4.2 1 5.9L12 17.3Z"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

export default function ReviewDialog({
  conversationId,
  professionalName,
}: {
  conversationId: string;
  professionalName: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function submit() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId, rating, comment }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; message?: string };
      if (!res.ok || !data.ok) {
        setError(data.message ?? "No se pudo guardar la valoración.");
        setSaving(false);
        return;
      }
      setSaving(false);
      setSuccess(true);
      router.refresh();
      window.setTimeout(() => {
        setOpen(false);
      }, 600);
    } catch {
      setError("Error inesperado al guardar la valoración.");
      setSaving(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
      >
        Valorar
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/30 p-4 sm:items-center">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">
            <div className="flex items-start justify-between gap-4 border-b border-gray-100 p-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Valorar profesional</p>
                <h2 className="mt-1 text-lg font-bold text-[var(--connectia-gray)]">
                  {professionalName}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                disabled={saving}
              >
                Cerrar
              </button>
            </div>

            <div className="space-y-4 p-5">
              <div>
                <p className="text-sm font-semibold text-gray-700">Puntuación</p>
                <div className="mt-2 flex items-center gap-1 text-[var(--connectia-gold)]">
                  {Array.from({ length: 5 }).map((_, i) => {
                    const n = i + 1;
                    return (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setRating(n)}
                        className="rounded p-1 transition hover:opacity-90"
                        aria-label={`${n} estrellas`}
                      >
                        <Star filled={n <= rating} />
                      </button>
                    );
                  })}
                  <span className="ml-2 text-sm font-semibold text-gray-700">{rating}/5</span>
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700">Comentario (opcional)</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={4}
                  maxLength={600}
                  className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-[var(--connectia-gold)] focus:outline-none focus:ring-1 focus:ring-[var(--connectia-gold)]"
                  placeholder="¿Cómo fue la experiencia? (máx 600 caracteres)"
                />
                <p className="mt-1 text-xs text-gray-500">{comment.length}/600</p>
              </div>

              {error ? <p className="text-sm text-red-600">{error}</p> : null}
              {success ? <p className="text-sm text-emerald-700">¡Gracias! Valoración guardada.</p> : null}

              <div className="flex flex-wrap justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                  disabled={saving}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => void submit()}
                  disabled={saving}
                  className="rounded-lg bg-[var(--connectia-gold)] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
                >
                  {saving ? "Guardando..." : "Guardar valoración"}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

