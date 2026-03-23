import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.APP_BASE_URL?.replace(/\/$/, "") || "http://localhost:3000";
  const staticRoutes = ["", "/servicios", "/contacto", "/quienes-somos"].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
  }));

  const services = await prisma.service.findMany({
    where: { active: true },
    select: { slug: true, updatedAt: true },
    take: 5000,
  });

  const serviceRoutes = services.map((s) => ({
    url: `${baseUrl}/servicios/${s.slug}`,
    lastModified: s.updatedAt,
  }));

  return [...staticRoutes, ...serviceRoutes];
}
