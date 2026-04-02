import Link from "next/link";
import { getPublicProfileName, truncateText } from "@/lib/publicProfile";
import { resolveServiceThumbnailSrc } from "@/lib/serviceMedia";

type Seller = {
  id: string;
  displayName: string | null;
  avatarUrl: string | null;
};

type Props = {
  /** En home u otras vistas se puede ocultar el acceso rápido a mensaje. */
  showMessageButton?: boolean;
  service: {
    id: string;
    slug: string;
    title: string;
    description: string | null;
    category?: string | null;
    thumbnailUrl?: string | null;
    shortDescription?: string | null;
    isPromoted?: boolean | null;
    promoExpiresAt?: Date | null;
    updatedAt?: Date;
    priceCents: number;
    deliveryDays: number;
    profile: Seller;
  };
  stats?: {
    avgRating?: number | null;
    reviewCount?: number;
    conversationCount?: number;
  };
};

function formatFromEuros(priceCents: number) {
  const euros = Math.max(0, Math.round(priceCents / 100));
  return Intl.NumberFormat("es-ES").format(euros);
}

export default function ServiceCard({ service, stats, showMessageButton = true }: Props) {
  const convoCount = stats?.conversationCount ?? 0;

  const title = service.title.length > 60 ? `${service.title.slice(0, 57)}...` : service.title;
  const sellerName = getPublicProfileName(service.profile as any);
  const sellerHref = `/profesionales/${encodeURIComponent(service.profile.id)}`;

  const isFast = service.deliveryDays <= 3;
  const isBestSeller = convoCount >= 3;
  const isPromoted = Boolean(service.isPromoted && service.promoExpiresAt && service.promoExpiresAt > new Date());

  const primaryHref = `/servicios/${encodeURIComponent(service.slug)}`;
  const contactHref = `/servicios/${encodeURIComponent(service.slug)}/contactar`;
  const cacheBuster = service.updatedAt ? `?v=${service.updatedAt.getTime()}` : "";
  const thumbnailSrc = resolveServiceThumbnailSrc(service.thumbnailUrl);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <Link href={primaryHref} className="block">
        <div className="relative aspect-[16/10] w-full bg-gradient-to-br from-gray-50 to-gray-100">
          {thumbnailSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={`${thumbnailSrc}${cacheBuster}`}
              alt={service.title}
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="rounded-xl border border-gray-200 bg-white/70 px-3 py-2 text-xs font-semibold text-gray-700 backdrop-blur">
                Vista previa del servicio
              </div>
            </div>
          )}

          <div className="absolute left-3 top-3 flex flex-wrap gap-2">
            {isPromoted && (
              <span className="rounded-full bg-[var(--connectia-gold)]/15 px-2 py-1 text-[11px] font-semibold text-[var(--connectia-gold)] ring-1 ring-[var(--connectia-gold)]/20">
                <span className="inline-flex items-center gap-1.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                      d="M12 17.3 6.8 20l1-5.9L3.6 9.9l5.9-.9L12 3.6l2.5 5.4 5.9.9-4.2 4.2 1 5.9L12 17.3Z"
                      fill="currentColor"
                    />
                  </svg>
                  Destacado
                </span>
              </span>
            )}
            {isBestSeller && (
              <span className="rounded-full bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-200">
                Más vendido
              </span>
            )}
            {isFast && (
              <span className="rounded-full bg-sky-50 px-2 py-1 text-[11px] font-semibold text-sky-700 ring-1 ring-sky-200">
                Entrega rápida
              </span>
            )}
          </div>
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link href={primaryHref} className="block">
              <h3 className="line-clamp-2 text-base font-semibold text-[var(--connectia-gray)] transition group-hover:text-[var(--connectia-gold)]">
                {title}
              </h3>
            </Link>
            {service.category ? (
              <div className="mt-2">
                <span className="inline-flex rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-[11px] font-semibold text-gray-700">
                  {service.category}
                </span>
              </div>
            ) : null}
          </div>
          <div className="shrink-0 text-right">
            <p className="text-xs text-gray-500">Desde</p>
            <p className="text-lg font-bold text-[var(--connectia-gold)]">{formatFromEuros(service.priceCents)} €</p>
          </div>
        </div>

        <div className="mt-3">
          {service.shortDescription ? (
            <p className="line-clamp-3 min-h-[4.5rem] pb-0.5 text-sm leading-6 text-gray-600">
              {service.shortDescription}
            </p>
          ) : service.description ? (
            <p className="line-clamp-3 min-h-[4.5rem] pb-0.5 text-sm leading-6 text-gray-600">
              {service.description}
            </p>
          ) : (
            <p className="min-h-[4.5rem] pb-0.5 text-sm leading-6 text-gray-400">
              Sin descripción adicional.
            </p>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="relative h-8 w-8 overflow-hidden rounded-full border border-gray-200 bg-gray-50">
              {service.profile.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={service.profile.avatarUrl} alt={sellerName} className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-[11px] font-semibold text-gray-600">
                  {sellerName.slice(0, 1).toUpperCase()}
                </div>
              )}
            </div>
            <div className="min-w-0">
              <Link href={sellerHref} className="block truncate text-xs font-semibold text-gray-800 hover:underline">
                {sellerName}
              </Link>
              <p className="text-[11px] text-gray-500">Entrega en {service.deliveryDays} {service.deliveryDays === 1 ? "día" : "días"}</p>
            </div>
          </div>
        </div>

        <div className={`mt-auto flex gap-2 pt-4 ${showMessageButton ? "" : "w-full"}`}>
          <Link
            href={primaryHref}
            className={`inline-flex items-center justify-center rounded-lg bg-[var(--connectia-gold)] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 ${showMessageButton ? "flex-1" : "w-full"}`}
          >
            Ver servicio
          </Link>
          {showMessageButton ? (
            <Link
              href={contactHref}
              className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              Mensaje
            </Link>
          ) : null}
        </div>
      </div>
    </article>
  );
}

