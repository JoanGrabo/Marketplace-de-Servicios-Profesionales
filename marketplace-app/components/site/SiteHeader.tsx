"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { SERVICE_CATEGORIES, SERVICE_SUBCATEGORIES } from "@/lib/validation";

type User = {
  id: string;
  email: string;
  role: string;
};

function Icon({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <span className="inline-flex h-9 w-9 items-center justify-center rounded-full text-gray-600 transition hover:bg-gray-100 hover:text-[var(--connectia-gold)]">
      <span className="sr-only">{label}</span>
      {children}
    </span>
  );
}

export default function SiteHeader({
  user,
  authDebugEnabled,
}: {
  user: User | null;
  authDebugEnabled: boolean;
}) {
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const qCurrent = pathname?.startsWith("/servicios") ? (searchParams?.get("q") ?? "") : "";

  const showAuthedNav = Boolean(user);

  const badge = useMemo(() => {
    if (!unreadCount || unreadCount <= 0) return null;
    return (
      <span className="ml-1 inline-flex min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] font-semibold leading-none text-white">
        {unreadCount > 99 ? "99+" : unreadCount}
      </span>
    );
  }, [unreadCount]);

  useEffect(() => {
    if (!user) {
      setUnreadCount(0);
      return;
    }
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/unread-count", { credentials: "include" });
        const data = (await res.json().catch(() => ({}))) as { unreadCount?: number };
        if (cancelled) return;
        const n = Number(data.unreadCount ?? 0);
        setUnreadCount(Number.isFinite(n) ? Math.max(0, Math.floor(n)) : 0);
      } catch {
        if (!cancelled) setUnreadCount(0);
      }
    }
    void load();
    const id = window.setInterval(load, 30000);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, [user]);

  return (
    <header className="border-b border-gray-200 bg-white">
      {/* Top bar */}
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-3">
          <Image
            src="/connectia-logo.png"
            alt="Mapahub"
            width={120}
            height={48}
            className="h-10 w-auto object-contain sm:h-12"
            priority
          />
          <div className="hidden sm:block">
            <span className="font-semibold tracking-tight text-[var(--connectia-gray)]">Mapa</span>
            <span className="font-semibold tracking-tight text-[var(--connectia-gold)]">hub</span>
            <p className="text-xs font-normal text-gray-500">Arquitectura y legal</p>
          </div>
        </Link>

        {/* Search */}
        <form
          action="/servicios"
          method="GET"
          className="hidden flex-1 items-center sm:flex"
        >
          <div className="flex w-full overflow-hidden rounded-full border border-gray-300 bg-white shadow-sm focus-within:border-[var(--connectia-gold)] focus-within:ring-1 focus-within:ring-[var(--connectia-gold)]">
            <input
              name="q"
              defaultValue={qCurrent}
              placeholder="¿Qué servicio estás buscando hoy?"
              className="w-full px-4 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center bg-[var(--connectia-gray)] px-4 text-white transition hover:bg-black"
              aria-label="Buscar"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M16.5 16.5 21 21"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        </form>

        {/* Right actions */}
        <div className="ml-auto flex items-center gap-1">
          {showAuthedNav ? (
            <>
              <Link href="/mis-servicios" className="hidden rounded-full px-3 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 sm:inline-flex">
                Publicar
              </Link>
              <Link href="/mensajes" className="relative">
                <Icon label="Mensajes">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v11A2.5 2.5 0 0 1 17.5 20H6.5A2.5 2.5 0 0 1 4 17.5v-11Z" stroke="currentColor" strokeWidth="2" />
                    <path d="m6.5 7 5.5 4.5L17.5 7" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                  </svg>
                </Icon>
                {badge ? <span className="absolute -right-1 -top-1">{badge}</span> : null}
              </Link>
              <Link href="/mi-perfil">
                <Icon label="Mi perfil">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-gray-200 text-xs font-bold text-gray-700">
                    {(user?.email?.[0] ?? "U").toUpperCase()}
                  </span>
                </Icon>
              </Link>
              <Link
                href="/auth/logout"
                className="hidden rounded-full bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 ring-1 ring-red-200 transition hover:bg-red-100 sm:inline-flex"
              >
                Salir
              </Link>
            </>
          ) : (
            <>
              <Link href="/servicios" className="hidden rounded-full px-3 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 sm:inline-flex">
                Explorar
              </Link>
              <Link
                href="/auth/login"
                className="rounded-full border border-[var(--connectia-gold)] px-4 py-2 text-sm font-semibold text-[var(--connectia-gold)] transition hover:bg-[var(--connectia-gold)] hover:text-white"
              >
                Entrar
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile search */}
      <div className="mx-auto max-w-6xl px-4 pb-3 sm:hidden">
        <form action="/servicios" method="GET">
          <div className="flex overflow-hidden rounded-full border border-gray-300 bg-white shadow-sm focus-within:border-[var(--connectia-gold)] focus-within:ring-1 focus-within:ring-[var(--connectia-gold)]">
            <input
              name="q"
              defaultValue={qCurrent}
              placeholder="Buscar servicios…"
              className="w-full px-4 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center bg-[var(--connectia-gray)] px-4 text-white transition hover:bg-black"
              aria-label="Buscar"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M16.5 16.5 21 21"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        </form>
      </div>

      {/* Categories bar */}
      <div className="border-t border-gray-100 bg-white">
        <nav className="mx-auto flex max-w-6xl items-center gap-6 overflow-x-auto px-4 py-2 text-sm font-semibold text-gray-700 sm:px-6">
          <Link href="/servicios" className="shrink-0 text-gray-700 hover:text-[var(--connectia-gold)]">
            Tendencias
          </Link>
          {SERVICE_CATEGORIES.map((c) => (
            <Link
              key={c}
              href={`/servicios?category=${encodeURIComponent(c)}`}
              className="shrink-0 text-gray-700 hover:text-[var(--connectia-gold)]"
            >
              {c}
            </Link>
          ))}
          {/* Subcategorías rápidas */}
          {SERVICE_SUBCATEGORIES.Arquitectura.slice(0, 3).map((sc) => (
            <Link
              key={`arq-${sc}`}
              href={`/servicios?category=${encodeURIComponent("Arquitectura")}&q=${encodeURIComponent(sc)}`}
              className="hidden shrink-0 text-gray-600 hover:text-[var(--connectia-gold)] sm:inline"
            >
              {sc}
            </Link>
          ))}
          {SERVICE_SUBCATEGORIES.Legal.slice(0, 3).map((sc) => (
            <Link
              key={`leg-${sc}`}
              href={`/servicios?category=${encodeURIComponent("Legal")}&q=${encodeURIComponent(sc)}`}
              className="hidden shrink-0 text-gray-600 hover:text-[var(--connectia-gold)] sm:inline"
            >
              {sc}
            </Link>
          ))}
        </nav>
      </div>

      {authDebugEnabled ? (
        <div className="mx-auto max-w-6xl px-4 pb-3 sm:px-6">
          <div
            className={`rounded-md px-3 py-2 text-xs ${
              user ? "bg-green-50 text-green-700 ring-1 ring-green-200" : "bg-amber-50 text-amber-700 ring-1 ring-amber-200"
            }`}
          >
            {user ? `AUTH DEBUG: logueado como ${user.email} (${user.role}).` : "AUTH DEBUG: no hay sesión activa en el servidor."}
          </div>
        </div>
      ) : null}
    </header>
  );
}

