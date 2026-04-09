import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { getFeaturedForHome } from "@/lib/homeData";
import HomeHero from "@/components/home/HomeHero";
import HomeActivity from "@/components/home/HomeActivity";
import HomeAreas from "@/components/home/HomeAreas";
import HomeFeatured from "@/components/home/HomeFeatured";
import HomeBenefits from "@/components/home/HomeBenefits";
import HomeForProfessionals from "@/components/home/HomeForProfessionals";
import HomeTrust from "@/components/home/HomeTrust";
import HomeFinalCta from "@/components/home/HomeFinalCta";
import { prisma } from "@/lib/db";
import ServiceCard from "@/app/servicios/_components/ServiceCard";

export default async function HomePage() {
  const user = await getCurrentUser();
  const publishHref = user
    ? "/mis-servicios"
    : `/auth/login?next=${encodeURIComponent("/mis-servicios")}`;

  const now = new Date();
  const since7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const [featured, professionalsCount, servicesCount, latestServices] = await Promise.all([
    getFeaturedForHome(6),
    prisma.profile.count({ where: { role: "profesional" } }).catch(() => 0),
    prisma.service.count({ where: { active: true } }).catch(() => 0),
    prisma.service
      .findMany({
        where: { active: true },
        orderBy: [{ createdAt: "desc" }],
        take: 6,
        select: {
          id: true,
          slug: true,
          title: true,
          description: true,
          shortDescription: true,
          category: true,
          thumbnailUrl: true,
          isPromoted: true,
          promoExpiresAt: true,
          priceCents: true,
          deliveryDays: true,
          updatedAt: true,
          profile: { select: { id: true, displayName: true, avatarUrl: true } },
        },
      })
      .catch(() => []),
  ]);

  // Social proof "fija" (sin depender de BD) para dar sensación de actividad.
  const newServices7d = 18;
  const conversations7d = 34;
  const featuredCount = 10;

  return (
    <main className="min-h-[calc(100vh-5rem)] bg-[var(--connectia-bg)]">
      <HomeHero
        publishHref={publishHref}
        stats={{
          professionals: Math.max(25, professionalsCount),
          services: Math.max(10, servicesCount),
        }}
      />
      <HomeActivity
        publishHref={publishHref}
        stats={{
          newServices7d,
          conversations7d,
          featuredCount,
        }}
      />
      <section className="border-b border-gray-200/80 bg-white py-14 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-8 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--connectia-gold)]">
                Nuevos
              </p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-[var(--connectia-gray)] sm:text-3xl">
                Últimos servicios publicados
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Lo más reciente del catálogo. Entra y contacta.
              </p>
            </div>
            <Link
              href="/servicios"
              className="inline-flex items-center text-sm font-semibold text-[var(--connectia-gold)] transition hover:underline"
            >
              Ver catálogo completo →
            </Link>
          </div>

          {latestServices.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50/50 p-10 text-center text-gray-600">
              Aún no hay servicios. Publica el primero y empieza a recibir contactos.
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {latestServices.map((s) => (
                <ServiceCard
                  key={s.id}
                  service={s as any}
                  stats={{ conversationCount: 0, reviewCount: 0, avgRating: null }}
                  showMessageButton={false}
                />
              ))}
            </div>
          )}
        </div>
      </section>
      <HomeAreas />
      <HomeFeatured items={featured} />
      <HomeBenefits />
      <HomeForProfessionals publishHref={publishHref} />
      <HomeTrust />
      <HomeFinalCta publishHref={publishHref} />
    </main>
  );
}
