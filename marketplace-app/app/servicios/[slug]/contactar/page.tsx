import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { resolveRouteParams, safeDecodeURIComponent } from "@/lib/routeParams";
import ContactarServicioForm from "./ContactarServicioForm";

type ContactarPageProps = {
  params: {
    slug: string;
  } | Promise<{
    slug: string;
  }>;
};

export const dynamic = "force-dynamic";

export default async function ContactarServicioPage({ params }: ContactarPageProps) {
  const { slug: rawSlug } = await resolveRouteParams(params);
  const slug = safeDecodeURIComponent(String(rawSlug ?? ""));

  const user = await getCurrentUser();
  const pagePath = `/servicios/${encodeURIComponent(slug)}/contactar`;
  if (!user) {
    redirect(`/auth/login?next=${encodeURIComponent(pagePath)}`);
  }

  const servicio = await prisma.service.findUnique({
    where: { slug },
    include: {
      profile: {
        select: {
          id: true,
          email: true,
        },
      },
    },
  });

  if (!servicio || !servicio.active) {
    redirect("/servicios");
  }

  if (servicio.profile.id === user.id) {
    redirect(`/servicios/${servicio.slug}`);
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <p className="mb-5 text-sm text-gray-500">
        <Link href={`/servicios/${servicio.slug}`} className="hover:underline">
          Volver al servicio
        </Link>
      </p>
      <h1 className="mb-2 text-3xl font-bold text-[var(--connectia-gray)]">Contactar profesional</h1>
      <p className="mb-6 text-gray-600">
        Envía un mensaje sobre <span className="font-medium">{servicio.title}</span>.
      </p>

      <ContactarServicioForm slug={servicio.slug} />
    </main>
  );
}
