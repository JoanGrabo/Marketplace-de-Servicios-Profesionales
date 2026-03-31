import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import "./globals.css";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import SiteFooter from "@/components/site/SiteFooter";

export const metadata: Metadata = {
  title: "Mapahub — Arquitectura y legal",
  description:
    "Marketplace especializado: servicios profesionales de arquitectura y asesoría legal. Contrata o publica con claridad.",
  icons: { icon: "/connectia-logo.png" },
  other: {
    "google-adsense-account": "ca-pub-4967206150420468",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();
  const authDebugEnabled = process.env.AUTH_DEBUG === "1";
  let unreadCount = 0;
  if (user) {
    try {
      unreadCount = await prisma.message.count({
        where: {
          readAt: null,
          senderId: { not: user.id },
          conversation: {
            OR: [{ clientId: user.id }, { professionalId: user.id }],
          },
        },
      });
    } catch {
      // Si la BD aún no tiene las tablas de mensajería, no romper el layout global.
      unreadCount = 0;
    }
  }

  return (
    <html lang="es">
      <body className="antialiased min-h-screen bg-gray-50 text-[var(--connectia-gray)]">
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4967206150420468"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        <header className="border-b border-gray-200 bg-white shadow-sm">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
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
            <nav className="flex flex-1 items-center justify-end gap-4 text-sm font-medium">
              <div className="flex items-center gap-4">
                <Link
                  href="/"
                  className="text-gray-600 transition hover:text-[var(--connectia-gold)]"
                >
                  Inicio
                </Link>
                <Link
                  href="/servicios"
                  className="text-gray-600 transition hover:text-[var(--connectia-gold)]"
                >
                  Servicios
                </Link>
                {user && (
                  <>
                    <Link
                      href="/mis-servicios"
                      className="text-gray-600 transition hover:text-[var(--connectia-gold)]"
                    >
                      Mis servicios
                    </Link>
                    <Link
                      href="/mi-perfil"
                      className="text-gray-600 transition hover:text-[var(--connectia-gold)]"
                    >
                      Mi perfil
                    </Link>
                    <Link
                      href="/mensajes"
                      className="text-gray-600 transition hover:text-[var(--connectia-gold)]"
                    >
                      Mensajes
                      {unreadCount > 0 && (
                        <span className="ml-1 inline-flex min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] font-semibold leading-none text-white">
                          {unreadCount > 99 ? "99+" : unreadCount}
                        </span>
                      )}
                    </Link>
                  </>
                )}
                {!user && (
                  <>
                    <Link
                      href="/quienes-somos"
                      className="text-gray-600 transition hover:text-[var(--connectia-gold)]"
                    >
                      Quiénes somos
                    </Link>
                    <Link
                      href="/contacto"
                      className="text-gray-600 transition hover:text-[var(--connectia-gold)]"
                    >
                      Contacto
                    </Link>
                  </>
                )}
                {!user && (
                  <Link
                    href="/auth/login"
                    className="rounded-lg border border-[var(--connectia-gold)] px-3 py-1 text-xs font-semibold text-[var(--connectia-gold)] transition hover:bg-[var(--connectia-gold)] hover:text-white"
                  >
                    Entrar
                  </Link>
                )}
              </div>
              {user && (
                <Link
                  href="/auth/logout"
                  className="rounded-lg bg-red-50 px-3 py-1 text-xs font-semibold text-red-700 ring-1 ring-red-200 transition hover:bg-red-100"
                >
                  Salir
                </Link>
              )}
            </nav>
          </div>
          {authDebugEnabled && (
            <div className="mx-auto max-w-6xl px-4 pb-3 sm:px-6">
              <div
                className={`rounded-md px-3 py-2 text-xs ${
                  user
                    ? "bg-green-50 text-green-700 ring-1 ring-green-200"
                    : "bg-amber-50 text-amber-700 ring-1 ring-amber-200"
                }`}
              >
                {user
                  ? `AUTH DEBUG: logueado como ${user.email} (${user.role}).`
                  : "AUTH DEBUG: no hay sesión activa en el servidor."}
              </div>
            </div>
          )}
        </header>
        {children}
        <SiteFooter user={user} />
      </body>
    </html>
  );
}
