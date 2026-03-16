import { prisma } from "@/lib/db";
import { randomUUID } from "node:crypto";

async function main() {
  // Crea (o reutiliza) un perfil demo
  const email = "demo@connectia.local";

  const profile =
    (await prisma.profile.findUnique({ where: { email } })) ??
    (await prisma.profile.create({
      data: {
        id: randomUUID(),
        email,
        name: "Profesional demo",
        role: "profesional",
      },
    }));

  const baseServices = [
    {
      title: "Proyecto básico de vivienda",
      slug: "proyecto-basico-vivienda",
      description:
        "Proyecto arquitectónico básico para vivienda unifamiliar: planos, memoria y asesoría inicial.",
      priceCents: 45000,
      deliveryDays: 14,
    },
    {
      title: "Pack renders interiores",
      slug: "pack-renders-interiores",
      description:
        "Hasta 5 renders fotorrealistas de interiores para presentar tu proyecto a clientes o inversores.",
      priceCents: 32000,
      deliveryDays: 10,
    },
    {
      title: "Planos para licencia de obra menor",
      slug: "planos-licencia-obra-menor",
      description:
        "Levantamiento y planos necesarios para tramitar una licencia de obra menor en tu ayuntamiento.",
      priceCents: 18000,
      deliveryDays: 7,
    },
    {
      title: "Asesoría online 60 minutos",
      slug: "asesoria-online-60-min",
      description:
        "Sesión online para revisar tu proyecto, dudas normativas o viabilidad antes de empezar la obra.",
      priceCents: 6000,
      deliveryDays: 2,
    },
  ];

  for (const s of baseServices) {
    await prisma.service.upsert({
      where: { slug: s.slug },
      update: {
        title: s.title,
        description: s.description,
        priceCents: s.priceCents,
        deliveryDays: s.deliveryDays,
        active: true,
      },
      create: {
        profileId: profile.id,
        title: s.title,
        slug: s.slug,
        description: s.description,
        priceCents: s.priceCents,
        deliveryDays: s.deliveryDays,
        active: true,
      },
    });
  }

  // eslint-disable-next-line no-console
  console.log("Seed completado: profile demo y servicios creados/actualizados.");
}

main()
  .catch((e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

