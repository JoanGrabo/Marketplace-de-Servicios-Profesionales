import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { validateServiceInput } from "@/lib/validation";
import { getPublicProfileName } from "@/lib/publicProfile";
import ServiceEditor from "./ServiceEditor";

type Params = {
  params: {
    id: string;
  };
  searchParams?: Record<string, string | string[] | undefined>;
};

export const dynamic = "force-dynamic";

function getPromotionOffer() {
  const priceRaw = Number(process.env.PROMOTION_PRICE_CENTS ?? "");
  const daysRaw = Number(process.env.PROMOTION_DAYS ?? "");
  const priceCents = Number.isFinite(priceRaw) && priceRaw > 0 ? Math.floor(priceRaw) : 499;
  const days = Number.isFinite(daysRaw) && daysRaw > 0 ? Math.floor(daysRaw) : 7;
  return { priceCents, days };
}

export default async function EditarServicioPage({ params, searchParams }: Params) {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/login");

  const promotionOffer = getPromotionOffer();
  const promote = String(searchParams?.promote ?? "") === "1";

  const servicio = await prisma.service.findFirst({
    where: {
      id: params.id,
      profileId: user.id,
    },
  });

  if (!servicio) {
    redirect("/mis-servicios");
  }

  const serviceId = servicio.id;
  const now = new Date();
  const promotionActive = Boolean(servicio.isPromoted && servicio.promoExpiresAt && servicio.promoExpiresAt > now);

  async function updateService(formData: FormData) {
    "use server";
    const current = await getCurrentUser();
    if (!current) redirect("/auth/login");

    const existing = await prisma.service.findFirst({
      where: { id: serviceId, profileId: current.id },
    });
    if (!existing) {
      redirect("/mis-servicios");
    }

    const title = String(formData.get("title") ?? "");
    const category = String(formData.get("category") ?? "");
    const subcategory = String(formData.get("subcategory") ?? "");
    const shortDescription = String(formData.get("shortDescription") ?? "");
    const description = String(formData.get("description") ?? "");
    const includesText = String(formData.get("includesText") ?? "");
    const requirementsText = String(formData.get("requirementsText") ?? "");
    const thumbnailUrl = String(formData.get("thumbnailUrl") ?? "");
    const priceEuros = Number(formData.get("priceEuros") ?? 0);
    const deliveryDays = Number(formData.get("deliveryDays") ?? 7);
    const fastDeliveryEnabled = formData.get("fastDeliveryEnabled") === "on";
    const fastDeliveryExtraEurosRaw = formData.get("fastDeliveryExtraEuros");
    const fastDeliveryExtraEuros =
      fastDeliveryExtraEurosRaw == null || fastDeliveryExtraEurosRaw === ""
        ? null
        : Number(fastDeliveryExtraEurosRaw);

    const validation = validateServiceInput({
      title,
      category,
      subcategory,
      shortDescription,
      description,
      includesText,
      requirementsText,
      thumbnailUrl,
      priceEuros,
      deliveryDays,
      fastDeliveryEnabled,
      fastDeliveryExtraEuros: fastDeliveryExtraEuros ?? undefined,
    });
    if (!validation.ok || !validation.data) {
      return;
    }
    const safe = validation.data;

    await prisma.service.updateMany({
      where: { id: existing.id, profileId: current.id },
      data: {
        title: safe.title,
        category: safe.category,
        subcategory: safe.subcategory,
        shortDescription: safe.shortDescription,
        description: safe.description,
        includesText: safe.includesText,
        requirementsText: safe.requirementsText,
        thumbnailUrl: safe.thumbnailUrl,
        priceCents: safe.priceCents,
        deliveryDays: safe.deliveryDays,
        fastDeliveryEnabled: safe.fastDeliveryEnabled,
        fastDeliveryExtraCents: safe.fastDeliveryExtraCents,
      },
    });

    redirect("/mis-servicios");
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="mb-2 text-3xl font-bold text-[var(--connectia-gray)]">Editar servicio</h1>
      <p className="mb-8 text-gray-600">Actualiza la ficha para que se vea mejor en el catálogo.</p>

      <ServiceEditor
        sellerName={getPublicProfileName(user)}
        serviceId={servicio.id}
        promotionActive={promotionActive}
        promoteOnLoad={promote}
        promotionOffer={promotionOffer}
        initial={servicio}
        action={updateService}
      />

      <div className="mt-6">
        <a
          href="/mis-servicios"
          className="inline-flex rounded-lg border border-gray-300 px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Volver a Mis servicios
        </a>
      </div>
    </main>
  );
}

