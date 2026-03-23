import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import "./globals.css";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "CONNECTIA — Conecta • Aprende • Crece",
  description:
    "Marketplace de servicios profesionales. Arquitectura, renders, planos, asesoría y próximamente servicios legales.",
  icons: { icon: "/connectia-logo.png" },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();

  return (
    <html lang="es">
      <body className="antialiased min-h-screen bg-gray-50 text-[var(--connectia-gray)]">
        <header className="border-b border-gray-200 bg-white shadow-sm">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
            <Link href="/" className="flex shrink-0 items-center gap-3">
              <Image
                src="/connectia-logo.png"
                alt="CONNECTIA"
                width={120}
                height={48}
                className="h-10 w-auto object-contain sm:h-12"
                priority
              />
              <div className="hidden sm:block">
                <span className="font-semibold tracking-tight text-[var(--connectia-gray)]">
                  CONNECT
                </span>
                <span className="font-semibold tracking-tight text-[var(--connectia-gold)]">
                  IA
                </span>
                <p className="text-xs font-normal text-gray-500">Conecta • Aprende • Crece</p>
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
                    </Link>
                  </>
                )}
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
        </header>
        {children}
      </body>
    </html>
  );
}
