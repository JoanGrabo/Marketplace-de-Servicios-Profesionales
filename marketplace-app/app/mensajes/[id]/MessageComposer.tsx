"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function MessageComposer({
  conversationId,
}: {
  conversationId: string;
}) {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = content.trim();
    if (!trimmed || loading) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/conversaciones/${conversationId}/mensajes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ message: trimmed }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(
          typeof err.message === "string" ? err.message : "Error al enviar",
        );
      }
      setContent("");
      router.refresh();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Error al enviar el mensaje");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row sm:items-end">
      <label className="sr-only" htmlFor="msg-content">
        Escribe un mensaje
      </label>
      <textarea
        id="msg-content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={2}
        placeholder="Escribe un mensaje…"
        className="min-h-[3rem] flex-1 resize-y rounded-xl border border-gray-200 bg-gray-50/80 px-4 py-3 text-sm text-[var(--connectia-gray)] shadow-inner outline-none transition placeholder:text-gray-400 focus:border-[var(--connectia-gold)] focus:bg-white focus:ring-2 focus:ring-[var(--connectia-gold)]/20"
        disabled={loading}
      />
      <button
        type="submit"
        disabled={loading || !content.trim()}
        className="shrink-0 rounded-xl bg-[var(--connectia-gold)] px-6 py-3 text-sm font-semibold text-[var(--connectia-gray)] shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Enviando…" : "Enviar"}
      </button>
    </form>
  );
}
