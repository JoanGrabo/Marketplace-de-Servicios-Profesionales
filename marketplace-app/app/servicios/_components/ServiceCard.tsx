import Image from "next/image";
import Link from "next/link";
import { getPublicProfileName, truncateText } from "@/lib/publicProfile";

type Seller = {
  id: string;
  displayName: string | null;
  avatarUrl: string | null;
  sellerLevel?: string | null;
};

type Props = {
  service: {
    id: string;
    slug: string;
    title: string;
    description: string | null;
    category?: string | null;
    thumbnailUrl?: string | null;
    priceCents: number;
    deliveryDays: number;
    profile: Seller;
  };
  stats?: {
    avgRating: number | null;
    reviewCount: number;
    conversationCount?: number;
  };
};

function Stars({ value }: { value: number }) {
  const clamped = Math.max(0, Math.min(5, value));
  const full = Math.floor(clamped);
  const half = clamped - full >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  const stars = "★".repeat(full) + (half ? "☆" : "") + "☆".repeat(empty);
  return <span aria-label={`${clamped.toFixed(1)} de 5`}>{stars}</span>;
}

function formatFromEuros(priceCents: number) {
  const euros = Math.max(0, Math.round(priceCents / 100));
  return Intl.NumberFormat("es-ES").format(euros);
}

export default function ServiceCard({ service, stats }: Props) {
  const avg = stats?.avgRating ?? null;
  const reviewCount = stats?.reviewCount ?? 0;
  const convoCount = stats?.conversationCount ?? 0;

  const title = service.title.length > 60 ? `${service.title.slice(0, 57)}...` : service.title;
  const sellerName = getPublicProfileName(service.profile as any);

  const isFast = service.deliveryDays <= 3;
  const isTopSeller = (service.profile.sellerLevel ?? "") === "top" || (avg !== null && avg >= 4.8 && reviewCount >= 5);
  const isBestSeller = convoCount >= 3;

  const primaryHref = `/servicios/${encodeURIComponent(service.slug)}`;
  const contactHref = `/servicios/${encodeURIComponent(service.slug)}/contactar`;

  return (
    <article className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <Link href={primaryHref} className="block">
        <div className="relative aspect-[16/10] w-full bg-gradient-to-br from-gray-50 to-gray-100">
          {service.thumbnailUrl ? (
            <Image
              src={service.thumbnailUrl}
              alt={service.title}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="rounded-xl border border-gray-200 bg-white/70 px-3 py-2 text-xs font-semibold text-gray-700 backdrop-blur">
                Vista previa del servicio
              </div>
            </div>
          )}

          <div className="absolute left-3 top-3 flex flex-wrap gap-2">
            {isTopSeller && (
              <span className="rounded-full bg-[var(--connectia-gold)]/15 px-2 py-1 text-[11px] font-semibold text-[var(--connectia-gold)] ring-1 ring-[var(--connectia-gold)]/20">
                Top vendedor
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

      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link href={primaryHref} className="block">
              <h3 className="line-clamp-2 text-base font-semibold text-[var(--connectia-gray)] transition group-hover:text-[var(--connectia-gold)]">
                {title}
              </h3>
            </Link>
            {service.category && (
              <p className="mt-1 text-xs font-medium text-gray-500">{service.category}</p>
            )}
          </div>
          <div className="shrink-0 text-right">
            <p className="text-xs text-gray-500">Desde</p>
            <p className="text-lg font-bold text-[var(--connectia-gold)]">{formatFromEuros(service.priceCents)} €</p>
          </div>
        </div>

        {service.description ? (
          <p className="text-sm text-gray-600">{truncateText(service.description, 90)}</p>
        ) : null}

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="relative h-8 w-8 overflow-hidden rounded-full border border-gray-200 bg-gray-50">
              {service.profile.avatarUrl ? (
                <Image src={service.profile.avatarUrl} alt={sellerName} fill sizes="32px" className="object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-[11px] font-semibold text-gray-600">
                  {sellerName.slice(0, 1).toUpperCase()}
                </div>
              )}
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold text-gray-800">{sellerName}</p>
              <p className="text-[11px] text-gray-500">Entrega en {service.deliveryDays} {service.deliveryDays === 1 ? "día" : "días"}</p>
            </div>
          </div>

          <div className="text-right text-xs text-gray-600">
            <div className="flex items-center justify-end gap-1 text-[var(--connectia-gold)]">
              <Stars value={avg ?? 0} />
              <span className="text-gray-700">{avg !== null ? avg.toFixed(1) : "—"}</span>
            </div>
            <div className="text-[11px] text-gray-500">
              {reviewCount > 0 ? `${reviewCount} reseñas` : "Sin reseñas"}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-1">
          <Link
            href={primaryHref}
            className="inline-flex flex-1 items-center justify-center rounded-lg bg-[var(--connectia-gold)] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Ver servicio
          </Link>
          <Link
            href={contactHref}
            className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            Mensaje
          </Link>
        </div>
      </div>
    </article>
  );
}

