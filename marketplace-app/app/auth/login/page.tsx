"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import GoogleSignInButton from "@/app/auth/_components/GoogleSignInButton";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextRaw = searchParams.get("next") ?? "/";
  const nextPath = nextRaw.startsWith("/") ? nextRaw : "/";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const verifiedStatus = searchParams.get("verified");
  const successMessage =
    verifiedStatus === "ok"
      ? "Correo verificado correctamente. Ya has iniciado sesión."
      : null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, remember }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.message ?? "No se ha podido iniciar sesión.");
        setLoading(false);
        return;
      }
      router.push(nextPath);
    } catch {
      setError("Error inesperado al iniciar sesión.");
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-md flex-col justify-center px-4 py-10 sm:px-6">
      <h1 className="mb-2 text-2xl font-bold text-[var(--connectia-gray)]">
        Iniciar sesión
      </h1>
      <p className="mb-8 text-sm text-gray-600">
        Accede a tu cuenta para contratar servicios o gestionarlos como profesional.
      </p>
      <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        {successMessage && <p className="rounded-md bg-green-50 p-3 text-sm text-green-700">{successMessage}</p>}
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">Entrar con Google</p>
          <GoogleSignInButton mode="login" redirectTo={nextPath} remember={remember} />
        </div>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-gray-500">o con email</span>
          </div>
        </div>
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
        <div>
          <label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-700">
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-[var(--connectia-gold)] focus:outline-none focus:ring-1 focus:ring-[var(--connectia-gold)]"
            placeholder="Tu contraseña"
          />
          <div className="mt-2 text-right">
            <a
              href="/auth/forgot-password"
              className="text-xs font-medium text-[var(--connectia-gold)] hover:underline"
            >
              He olvidado mi contraseña
            </a>
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm text-gray-600">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-[var(--connectia-gold)] focus:ring-[var(--connectia-gold)]"
          />
          Mantener sesión iniciada
        </label>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-[var(--connectia-gold)] px-4 py-3 font-medium text-white transition hover:opacity-90 disabled:opacity-60"
        >
          {loading ? "Accediendo..." : "Iniciar sesión"}
        </button>
        <p className="text-center text-sm text-gray-500">
          ¿No tienes cuenta todavía?{" "}
          <a href="/auth/registro" className="font-medium text-[var(--connectia-gold)] hover:underline">
            Regístrate
          </a>
        </p>
      </form>
    </main>
  );
}

