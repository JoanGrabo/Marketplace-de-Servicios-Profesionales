import { prisma } from "@/lib/db";

export type HomeFeaturedService = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  shortDescription: string | null;
  category: string | null;
  thumbnailUrl: string | null;
  isPromoted: boolean;
  priceCents: number;
  deliveryDays: number;
  updatedAt: Date;
  profile: {
    id: string;
    displayName: string | null;
    avatarUrl: string | null;
  };
};

export type HomeFeaturedItem = {
  service: HomeFeaturedService;
  stats: { conversationCount: number };
};

/** Servicios para la home: prioriza promocionados y recientes. */
export async function getFeaturedForHome(limit = 6): Promise<HomeFeaturedItem[]> {
  const rows = await prisma.service.findMany({
    where: { active: true },
    orderBy: [{ isPromoted: "desc" }, { promoExpiresAt: "desc" }, { updatedAt: "desc" }],
    take: limit,
    select: {
      id: true,
      slug: true,
      title: true,
      description: true,
      shortDescription: true,
      category: true,
      thumbnailUrl: true,
      isPromoted: true,
      priceCents: true,
      deliveryDays: true,
      updatedAt: true,
      profile: {
        select: { id: true, displayName: true, avatarUrl: true },
      },
    },
  });

  const ids = rows.map((r) => r.id);
  const convoStats =
    ids.length > 0
      ? await prisma.conversation
          .groupBy({
            by: ["serviceId"],
            where: { serviceId: { in: ids } },
            _count: { id: true },
          })
          .catch(() => [])
      : [];

  const countById = new Map<string, number>();
  for (const c of convoStats) {
    countById.set(c.serviceId, c._count.id ?? 0);
  }

  return rows.map((service) => ({
    service,
    stats: { conversationCount: countById.get(service.id) ?? 0 },
  }));
}
