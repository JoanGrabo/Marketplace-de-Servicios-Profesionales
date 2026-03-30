import { getCurrentUser } from "@/lib/auth";
import { getFeaturedForHome } from "@/lib/homeData";
import HomeHero from "@/components/home/HomeHero";
import HomeAreas from "@/components/home/HomeAreas";
import HomeFeatured from "@/components/home/HomeFeatured";
import HomeBenefits from "@/components/home/HomeBenefits";
import HomeForProfessionals from "@/components/home/HomeForProfessionals";
import HomeTrust from "@/components/home/HomeTrust";
import HomeFinalCta from "@/components/home/HomeFinalCta";

export default async function HomePage() {
  const user = await getCurrentUser();
  const publishHref = user
    ? "/mis-servicios"
    : `/auth/login?next=${encodeURIComponent("/mis-servicios")}`;

  const featured = await getFeaturedForHome(6);

  return (
    <main className="min-h-[calc(100vh-5rem)] bg-[var(--connectia-bg)]">
      <HomeHero publishHref={publishHref} />
      <HomeAreas />
      <HomeFeatured items={featured} />
      <HomeBenefits />
      <HomeForProfessionals publishHref={publishHref} />
      <HomeTrust />
      <HomeFinalCta publishHref={publishHref} />
    </main>
  );
}
