import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { getPublicProfileName } from "@/lib/publicProfile";

export const dynamic = "force-dynamic";

type Props = {
  params: { id: string } | Promise<{ id: string }>;
};

export default async function ProfesionalPublicoPage({ params }: Props) {
  const p = await params;
  const id = String((p as any)?.id ?? "");

  const profile = await prisma.profile.findUnique({
    where: { id },
    select: {
      id: true,
      displayName: true,
      headline: true,
      bio: true,
      city: true,
      websiteUrl: true,
      linkedinUrl: true,
      instagramUrl: true,
      xUrl: true,
      colegiadoNumber: true,
      avatarUrl: true,
      updatedAt: true,
      services: {
        where: { active: true },
        orderBy: [{ isPromoted: "desc" }, { promoExpiresAt: "desc" }, { createdAt: "desc" }],
        take: 50,
        select: {
          id: true,
          slug: true,
          title: true,
          shortDescription: true,
          priceCents: true,
          deliveryDays: true,
          isPromoted: true,
          promoExpiresAt: true,
          updatedAt: true,
          thumbnailUrl: true,
        },
      },
    },
  });

  if (!profile) notFound();

  const name = getPublicProfileName(profile);
  const avatarSrc =
    profile.avatarUrl && profile.updatedAt
      ? `${profile.avatarUrl}${profile.avatarUrl.includes("?") ? "&" : "?"}v=${profile.updatedAt.getTime()}`
      : profile.avatarUrl;

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <p className="text-sm text-gray-500">
          <Link href="/servicios" className="hover:underline">
            Servicios
          </Link>{" "}
          / Profesional
        </p>
        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-5">
          {avatarSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatarSrc}
              alt=""
              className="h-16 w-16 shrink-0 rounded-full object-cover ring-1 ring-gray-200"
            />
          ) : (
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xl font-semibold text-gray-500 ring-1 ring-gray-200">
              {name.trim().slice(0, 1).toUpperCase()}
            </div>
          )}
          <div className="min-w-0">
            <h1 className="text-3xl font-bold text-[var(--connectia-gray)]">{name}</h1>
            <p className="mt-2 text-gray-600">
              {profile.headline ? <span className="font-medium text-gray-800">{profile.headline}</span> : null}
              {profile.city ? <span> · {profile.city}</span> : null}
              {profile.colegiadoNumber ? <span> · Nº colegiado {profile.colegiadoNumber}</span> : null}
            </p>
            <div className="mt-3 flex flex-wrap gap-3 text-sm">
              {profile.websiteUrl ? (
                <a href={profile.websiteUrl} target="_blank" rel="noreferrer" className="font-semibold text-[var(--connectia-gold)] hover:underline">
                  Web
                </a>
              ) : null}
              {profile.linkedinUrl ? (
                <a href={profile.linkedinUrl} target="_blank" rel="noreferrer" className="font-semibold text-[var(--connectia-gold)] hover:underline">
                  LinkedIn
                </a>
              ) : null}
              {profile.instagramUrl ? (
                <a href={profile.instagramUrl} target="_blank" rel="noreferrer" className="font-semibold text-[var(--connectia-gold)] hover:underline">
                  Instagram
                </a>
              ) : null}
              {profile.xUrl ? (
                <a href={profile.xUrl} target="_blank" rel="noreferrer" className="font-semibold text-[var(--connectia-gold)] hover:underline">
                  X
                </a>
              ) : null}
            </div>
          </div>
        </div>
        {profile.bio ? <p className="mt-4 max-w-3xl whitespace-pre-wrap text-gray-700">{profile.bio}</p> : null}
      </div>

      <h2 className="mb-4 text-lg font-semibold text-[var(--connectia-gray)]">Servicios</h2>
      {profile.services.length === 0 ? (
        <p className="text-gray-500">Este profesional todavía no tiene servicios activos.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {profile.services.map((s) => (
            <article key={s.id} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <h3 className="min-w-0 text-base font-semibold text-[var(--connectia-gray)]">
                  <Link href={`/servicios/${encodeURIComponent(s.slug)}`} className="hover:underline">
                    {s.title}
                  </Link>
                </h3>
                <div className="shrink-0 text-right">
                  <p className="text-xs text-gray-500">Desde</p>
                  <p className="text-lg font-bold text-[var(--connectia-gold)]">
                    {Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(
                      s.priceCents / 100,
                    )}
                  </p>
                </div>
              </div>
              {s.shortDescription ? <p className="mt-2 text-sm text-gray-600">{s.shortDescription}</p> : null}
              <p className="mt-3 text-xs text-gray-500">Entrega en {s.deliveryDays} días</p>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}

