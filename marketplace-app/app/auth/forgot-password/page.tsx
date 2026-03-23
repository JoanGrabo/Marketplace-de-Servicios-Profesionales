"use client";

import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.message ?? "No se pudo procesar tu solicitud.");
        setLoading(false);
        return;
      }
      setMessage(data.message ?? "Si el email existe, te hemos enviado un enlace.");
      setLoading(false);
    } catch {
      setError("Error inesperado al enviar la solicitud.");
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-md flex-col justify-center px-4 py-10 sm:px-6">
      <h1 className="mb-2 text-2xl font-bold text-[var(--connectia-gray)]">Recuperar contraseña</h1>
      <p className="mb-8 text-sm text-gray-600">
        Introduce tu email y te enviaremos un enlace para restablecer tu contraseña.
      </p>
      <form onSubmit={onSubmit} className="space-y-5 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-[var(--connectia-gold)] focus:outline-none focus:ring-1 focus:ring-[var(--connectia-gold)]"
            placeholder="tu@email.com"
          />
        </div>
        {message && <p className="rounded-md bg-green-50 p-3 text-sm text-green-700">{message}</p>}
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-[var(--connectia-gold)] px-4 py-3 font-medium text-white transition hover:opacity-90 disabled:opacity-60"
        >
          {loading ? "Enviando..." : "Enviar enlace"}
        </button>
      </form>
    </main>
  );
}
