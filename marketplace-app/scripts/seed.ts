import { prisma } from "../lib/db";
import { randomUUID } from "node:crypto";

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function main() {
  const enabled = process.env.SEED_DEMO === "1";
  if (!enabled) {
    // eslint-disable-next-line no-console
    console.log('Seed demo desactivado. Para crear datos demo usa: SEED_DEMO=1 npm run db:seed');
    return;
  }

  // Perfiles demo (profesionales)
  const professionals = [
    { email: "demo.arq@expertysm.local", name: "Estudio Demo" },
    { email: "demo.legal@expertysm.local", name: "Asesoría Demo" },
    { email: "demo.bim@expertysm.local", name: "BIM Demo" },
  ];

  const createdProfiles = [];
  for (const p of professionals) {
    const profile = await prisma.profile.upsert({
      where: { email: p.email },
      update: { name: p.name, role: "profesional" },
      create: {
        id: randomUUID(),
        email: p.email,
        name: p.name,
        role: "profesional",
        authProvider: "credentials",
        emailVerifiedAt: new Date(),
      },
    });
    createdProfiles.push(profile);
  }

  const now = new Date();
  const in7 = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  const baseServices = [
    {
      title: "Render de vivienda moderna (exterior)",
      category: "Arquitectura",
      subcategory: "Renders",
      shortDescription: "Exterior fotorrealista con 2 revisiones. Entrega rápida y archivos en alta.",
      description:
        "Creo un render exterior fotorrealista de tu vivienda a partir de planos/3D. Incluye iluminación, materiales y 2 rondas de revisión. Entrega en alta resolución y versión para redes.",
      priceCents: 12000,
      deliveryDays: 5,
      profileIndex: 0,
      promoted: true,
    },
    {
      title: "Render interior realista (salón/cocina)",
      category: "Arquitectura",
      subcategory: "Renders",
      shortDescription: "Interior fotorrealista con materiales y luz natural. 2 revisiones incluidas.",
      description:
        "Render interior realista para presentar a clientes o invertir con seguridad. Trabajo con tu modelo o lo genero con referencias. Incluye 2 revisiones y entrega en alta.",
      priceCents: 10000,
      deliveryDays: 6,
      profileIndex: 0,
    },
    {
      title: "Planos para licencia de obra menor",
      category: "Arquitectura",
      subcategory: "Planos",
      shortDescription: "Planos listos para presentar al ayuntamiento. Incluye revisión de requisitos.",
      description:
        "Levantamiento y planos necesarios para tramitar una licencia de obra menor. Incluye revisión del checklist habitual y entrega en PDF + DWG si aplica.",
      priceCents: 18000,
      deliveryDays: 7,
      profileIndex: 0,
    },
    {
      title: "Proyecto básico de vivienda unifamiliar",
      category: "Arquitectura",
      subcategory: "Proyecto",
      shortDescription: "Memoria + planos básicos. Ideal para empezar con criterio y ajustar presupuesto.",
      description:
        "Proyecto básico para vivienda unifamiliar: planos, memoria y asesoría inicial. Perfecto para arrancar, hablar con constructor y preparar el siguiente paso.",
      priceCents: 45000,
      deliveryDays: 14,
      profileIndex: 0,
    },
    {
      title: "Modelado 3D BIM (Revit) a partir de planos",
      category: "Arquitectura",
      subcategory: "Modelado 3D",
      shortDescription: "Modelo BIM limpio y ordenado. Incluye niveles, familias básicas y export IFC.",
      description:
        "Genero un modelo BIM en Revit a partir de tus planos PDF/DWG. Incluye estructura básica, niveles, familias estándar y export a IFC. Ideal para coordinación.",
      priceCents: 25000,
      deliveryDays: 10,
      profileIndex: 2,
    },
    {
      title: "Asesoría online 60 minutos (arquitectura)",
      category: "Arquitectura",
      subcategory: "Asesoría",
      shortDescription: "Sesión 1:1 para dudas de obra, distribución, normativas básicas y próximos pasos.",
      description:
        "Sesión online para revisar tu proyecto, dudas de distribución, viabilidad o próximos pasos. Te vas con un plan claro y checklist de acciones.",
      priceCents: 6000,
      deliveryDays: 2,
      profileIndex: 0,
    },
    {
      title: "Revisión de contrato de alquiler",
      category: "Legal",
      subcategory: "Contratos",
      shortDescription: "Detecto cláusulas de riesgo y propongo mejoras. Resumen claro y recomendaciones.",
      description:
        "Reviso tu contrato de alquiler y te marco puntos de riesgo, cláusulas abusivas y mejoras. Incluye un resumen claro y sugerencias para negociar.",
      priceCents: 9500,
      deliveryDays: 5,
      profileIndex: 1,
    },
    {
      title: "Redacción de contrato de prestación de servicios",
      category: "Legal",
      subcategory: "Contratos",
      shortDescription: "Contrato claro para trabajar con clientes. Incluye 1 revisión y entregables definidos.",
      description:
        "Redacto un contrato de prestación de servicios adaptado a tu actividad. Incluye alcance, plazos, pagos, propiedad intelectual y cláusulas esenciales.",
      priceCents: 16000,
      deliveryDays: 7,
      profileIndex: 1,
    },
    {
      title: "Reclamación (consumo) y escrito inicial",
      category: "Legal",
      subcategory: "Reclamaciones",
      shortDescription: "Te preparo el escrito y la estrategia inicial. Checklist de pruebas y siguientes pasos.",
      description:
        "Analizo tu caso y preparo el escrito inicial de reclamación. Te doy una guía de pruebas, plazos y siguientes pasos para avanzar con seguridad.",
      priceCents: 11000,
      deliveryDays: 6,
      profileIndex: 1,
    },
    {
      title: "Asesoría jurídica 45 minutos",
      category: "Legal",
      subcategory: "Asesoría",
      shortDescription: "Sesión 1:1 para entender tu situación y salir con un plan de acción.",
      description:
        "Sesión online para revisar tu caso (contratos, reclamaciones, dudas generales). Te llevas un plan claro y prioridades.",
      priceCents: 7500,
      deliveryDays: 2,
      profileIndex: 1,
    },
    {
      title: "Pack planos de reforma (básico)",
      category: "Arquitectura",
      subcategory: "Reformas",
      shortDescription: "Plantas + alzados básicos + propuesta de distribución. Ideal para arrancar reforma.",
      description:
        "Pack de planos para reforma: distribución propuesta, plantas y alzados básicos. Incluye 1 ronda de ajustes y entrega en PDF.",
      priceCents: 22000,
      deliveryDays: 10,
      profileIndex: 0,
    },
    {
      title: "Modelado 3D simple para presentación",
      category: "Arquitectura",
      subcategory: "Modelado 3D",
      shortDescription: "Modelo 3D limpio para enseñar el espacio. Incluye vistas y export estándar.",
      description:
        "Modelo 3D sencillo a partir de planos para presentación. Incluye vistas clave y export estándar (OBJ/FBX/IFC según caso).",
      priceCents: 15000,
      deliveryDays: 7,
      profileIndex: 2,
    },
    {
      title: "Checklist legal para empezar una obra (básico)",
      category: "Legal",
      subcategory: "Asesoría",
      shortDescription: "Qué permisos necesitas y qué documentación preparar. Enfoque práctico.",
      description:
        "Te preparo un checklist legal básico para arrancar una obra: permisos, documentación y pasos típicos (orientativo, no sustituye asesoría completa).",
      priceCents: 8500,
      deliveryDays: 4,
      profileIndex: 1,
    },
    {
      title: "Entrega BIM: export IFC + revisión de capas",
      category: "Arquitectura",
      subcategory: "BIM",
      shortDescription: "Dejo tu modelo listo para compartir: IFC, capas y limpieza de elementos.",
      description:
        "Reviso tu modelo y preparo una entrega BIM limpia: export IFC, limpieza de elementos y organización de capas/propiedades para coordinación.",
      priceCents: 14000,
      deliveryDays: 5,
      profileIndex: 2,
    },
    {
      title: "Revisión rápida de presupuesto de obra",
      category: "Arquitectura",
      subcategory: "Asesoría",
      shortDescription: "Identifico partidas críticas y riesgos. Te doy preguntas para el constructor.",
      description:
        "Reviso tu presupuesto de obra y te marco partidas críticas, riesgos y preguntas clave para comparar ofertas con criterio.",
      priceCents: 9000,
      deliveryDays: 3,
      profileIndex: 0,
    },
  ];

  for (const s of baseServices) {
    const slug = slugify(s.title);
    const profile = createdProfiles[Math.max(0, Math.min(createdProfiles.length - 1, s.profileIndex))];
    await prisma.service.upsert({
      where: { slug },
      update: {
        title: s.title,
        category: s.category,
        subcategory: s.subcategory,
        shortDescription: s.shortDescription,
        description: s.description,
        priceCents: s.priceCents,
        deliveryDays: s.deliveryDays,
        active: true,
        isPromoted: Boolean(s.promoted),
        promoExpiresAt: s.promoted ? in7 : null,
      },
      create: {
        profileId: profile.id,
        title: s.title,
        slug,
        category: s.category,
        subcategory: s.subcategory,
        shortDescription: s.shortDescription,
        description: s.description,
        priceCents: s.priceCents,
        deliveryDays: s.deliveryDays,
        active: true,
        isPromoted: Boolean(s.promoted),
        promoExpiresAt: s.promoted ? in7 : null,
      },
    });
  }

  // eslint-disable-next-line no-console
  console.log("Seed demo completado: perfiles demo y servicios creados/actualizados.");
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

