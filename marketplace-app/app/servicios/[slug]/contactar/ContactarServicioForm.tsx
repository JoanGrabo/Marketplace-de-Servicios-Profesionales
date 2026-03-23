"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  slug: string;
};

export default function ContactarServicioForm({ slug }: Props) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSending(true);
    try {
      const res = await fetch(`/api/servicios/${slug}/contactar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.message ?? "No se pudo enviar el mensaje.");
        setSending(false);
        return;
      }
      setSuccess("Mensaje enviado correctamente.");
      setMessage("");
      setSending(false);
      setTimeout(() => {
        router.push(`/servicios/${slug}`);
        router.refresh();
      }, 900);
    } catch {
      setError("Error inesperado al enviar el mensaje.");
      setSending(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
    >
      <div>
        <label htmlFor="mensaje" className="mb-1 block text-sm font-medium text-gray-700">
          Tu mensaje
        </label>
        <textarea
          id="mensaje"
          name="mensaje"
          rows={6}
          required
          minLength={10}
          maxLength={2000}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-[var(--connectia-gold)] focus:outline-none focus:ring-1 focus:ring-[var(--connectia-gold)]"
          placeholder="Hola, me interesa este servicio para..."
        />
      </div>
      {success && <p className="text-sm text-green-700">{success}</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={sending}
        className="rounded-lg bg-[var(--connectia-gold)] px-5 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
      >
        {sending ? "Enviando..." : "Enviar mensaje"}
      </button>
    </form>
  );
}
