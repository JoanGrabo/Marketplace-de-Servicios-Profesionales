import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { getCurrentUser } from "@/lib/auth";
import SiteFooter from "@/components/site/SiteFooter";
import SiteHeader from "@/components/site/SiteHeader";

export const metadata: Metadata = {
  title: "Expertysm — Arquitectura y legal",
  description:
    "Marketplace especializado: servicios profesionales de arquitectura y asesoría legal. Contrata o publica con claridad.",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
  },
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

  return (
    <html lang="es">
      <body className="antialiased min-h-screen bg-gray-50 text-[var(--connectia-gray)]">
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4967206150420468"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        <SiteHeader
          user={user ? { id: user.id, email: user.email, role: user.role } : null}
          authDebugEnabled={authDebugEnabled}
        />
        {children}
        <SiteFooter user={user} />
      </body>
    </html>
  );
}
