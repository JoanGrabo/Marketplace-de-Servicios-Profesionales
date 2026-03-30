import Link from "next/link";
import type { Profile } from "@prisma/client";

type Props = {
  user: Profile | null;
};

export default function SiteFooter({ user }: Props) {
  const publishHref = user
    ? "/mis-servicios"
    : `/auth/login?next=${encodeURIComponent("/mis-servicios")}`;

  return (
    <footer className="border-t border-gray-200 bg-[#1a1a1a] text-gray-300">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <p className="text-lg font-bold tracking-tight text-white">
              <span className="text-white">Mapa</span>
              <span className="text-[var(--connectia-gold)]">hub</span>
            </p>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-gray-400">
              Marketplace especializado en servicios de <strong className="font-medium text-gray-300">Arquitectura</strong> y{" "}
              <strong className="font-medium text-gray-300">Legal</strong>. Contrata o publica con claridad.
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Explorar</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link href="/" className="transition hover:text-white">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="/servicios" className="transition hover:text-white">
                  Servicios
                </Link>
              </li>
              <li>
                <Link href="/servicios?category=Arquitectura" className="transition hover:text-white">
                  Arquitectura
                </Link>
              </li>
              <li>
                <Link href="/servicios?category=Legal" className="transition hover:text-white">
                  Legal
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Cuenta</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link href={publishHref} className="transition hover:text-white">
                  Publicar servicio
                </Link>
              </li>
              {user ? (
                <>
                  <li>
                    <Link href="/mi-perfil" className="transition hover:text-white">
                      Mi perfil
                    </Link>
                  </li>
                  <li>
                    <Link href="/mensajes" className="transition hover:text-white">
                      Mensajes
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link href="/auth/login" className="transition hover:text-white">
                      Entrar
                    </Link>
                  </li>
                  <li>
                    <Link href="/quienes-somos" className="transition hover:text-white">
                      Quiénes somos
                    </Link>
                  </li>
                  <li>
                    <Link href="/contacto" className="transition hover:text-white">
                      Contacto
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-white/10 pt-8">
          <nav
            className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-gray-400"
            aria-label="Información legal"
          >
            <Link href="/preguntas-frecuentes" className="transition hover:text-white">
              Preguntas frecuentes
            </Link>
            <Link href="/cookies" className="transition hover:text-white">
              Cookies
            </Link>
            <Link href="/terminos-y-condiciones" className="transition hover:text-white">
              Términos y condiciones
            </Link>
            <Link href="/privacidad" className="transition hover:text-white">
              Privacidad
            </Link>
          </nav>
          <p className="mt-8 text-xs text-gray-500">© Barcelona | 2026</p>
        </div>
      </div>
    </footer>
  );
}
