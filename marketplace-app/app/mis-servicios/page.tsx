import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { isAdmin } from "@/lib/admin";
import { validateServiceInput } from "@/lib/validation";
import { getPublicProfileName } from "@/lib/publicProfile";
import ServiceComposer from "@/app/mis-servicios/ServiceComposer";
import PromoteServiceButton from "@/app/mis-servicios/_components/PromoteServiceButton";

export const dynamic = "force-dynamic";

type Props = {
  searchParams?: {
    limit?: string;
  };
};

function getPromotionOffer() {
  const priceRaw = Number(process.env.PROMOTION_PRICE_CENTS ?? "");
  const daysRaw = Number(process.env.PROMOTION_DAYS ?? "");
  const priceCents = Number.isFinite(priceRaw) && priceRaw > 0 ? Math.floor(priceRaw) : 499;
  const days = Number.isFinite(daysRaw) && daysRaw > 0 ? Math.floor(daysRaw) : 7;
  return { priceCents, days };
}

export default async function MisServiciosPage({ searchParams }: Props) {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/login");

  const admin = isAdmin(user);
  const promotionOffer = getPromotionOffer();
  const now = new Date();

  const services = await prisma.service.findMany({
    where: { profileId: user.id },
    orderBy: { createdAt: "desc" },
    include: {
      profile: {
        select: {
          id: true,
          displayName: true,
        },
      },
    },
  });

  async function createService(formData: FormData) {
    "use server";
    const current = await getCurrentUser();
    if (!current) redirect("/auth/login");
    const adminCurrent = isAdmin(current);

    if (!adminCurrent) {
      const count = await prisma.service.count({ where: { profileId: current.id } });
      if (count >= 3) {
        redirect("/mis-servicios?limit=1");
      }
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
    const promoteAfterPublish = formData.get("promoteAfterPublish") === "on";
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

    const slugBase = safe.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    const slug = `${slugBase}-${Date.now().toString(36)}`;

    const created = await prisma.service.create({
      data: {
        profileId: current.id,
        title: safe.title,
        slug,
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
        isPromoted: false,
        active: true,
      },
      select: { id: true },
    });

    // Después de publicar, si marcó “Destacar”, llevamos a editar y autoiniciamos el pago.
    redirect(`/mis-servicios/editar/${created.id}?new=1${promoteAfterPublish ? "&promote=1" : ""}`);
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="mb-2 text-3xl font-bold text-[var(--connectia-gray)]">
        Mis servicios
      </h1>
      <p className="mb-8 text-gray-600">
        Crea y gestiona los servicios que ofreces en Expertysm.
      </p>
      {String(searchParams?.limit ?? "") === "1" && (
        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          Has alcanzado el límite de <strong>3 servicios</strong>. Para publicar más, elimina alguno o destaca los
          actuales.
        </div>
      )}

      <div className="mb-10">
        <ServiceComposer sellerName={getPublicProfileName(user)} action={createService} promotionOffer={promotionOffer} />
      </div>

      <h2 className="mb-4 text-lg font-semibold text-[var(--connectia-gray)]">
        Servicios publicados por ti
      </h2>
      {services.length === 0 ? (
        <p className="text-gray-500">Todavía no has creado ningún servicio.</p>
      ) : (
        <ul className="space-y-4">
          {services.map((s) => (
            <li
              key={s.id}
              className="flex items-center justify-between gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
            >
              <div className="min-w-0">
                <h3 className="font-semibold text-[var(--connectia-gray)]">
                  <Link href={`/servicios/${s.slug}`} className="hover:underline">
                    {s.title}
                  </Link>
                </h3>
                {s.description && (
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {s.description}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="text-right">
                  <div className="font-semibold text-[var(--connectia-gold)]">
                    {Intl.NumberFormat("es-ES", {
                      style: "currency",
                      currency: "EUR",
                      maximumFractionDigits: 0,
                    }).format(s.priceCents / 100)}
                  </div>
                  <div className="text-xs text-gray-500">
                    <div>{getPublicProfileName(s.profile)}</div>
                    <div>
                      {s.deliveryDays} {s.deliveryDays === 1 ? "día" : "días"}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  {(() => {
                    const promotionActive = Boolean(s.isPromoted && (s as any).promoExpiresAt && (s as any).promoExpiresAt > now);
                    if (promotionActive) {
                      const until = new Date((s as any).promoExpiresAt);
                      const untilLabel = Intl.DateTimeFormat("es-ES", { dateStyle: "medium" }).format(until);
                      return (
                        <div className="flex w-44 flex-col items-end gap-1">
                          <span className="inline-flex h-9 w-full items-center justify-center rounded-lg bg-[var(--connectia-gold)]/15 px-3 text-center text-[11px] font-semibold leading-tight text-[var(--connectia-gold)] ring-1 ring-[var(--connectia-gold)]/20">
                            <span className="line-clamp-2">Destacado hasta {untilLabel}</span>
                          </span>
                          <p className="text-right text-[11px] text-gray-500">
                            Apareces más arriba en el catálogo.
                          </p>
                        </div>
                      );
                    }
                    return (
                      <PromoteServiceButton serviceId={s.id} offer={promotionOffer} />
                    );
                  })()}
                  <a
                    href={`/mis-servicios/editar/${s.id}`}
                    className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-700 transition hover:bg-gray-100"
                  >
                    Editar
                  </a>
                  <form
                    action={async () => {
                      "use server";
                      await prisma.service.deleteMany({
                        where: { id: s.id, profileId: user.id },
                      });
                      redirect("/mis-servicios");
                    }}
                  >
                    <button
                      type="submit"
                      className="rounded-lg border border-red-200 bg-red-50 px-3 py-1 text-xs font-medium text-red-700 transition hover:bg-red-100"
                    >
                      Borrar
                    </button>
                  </form>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <p className="mt-8 text-sm text-gray-500">
        Tus servicios también aparecerán en la página pública de{" "}
        <Link
          href="/servicios"
          className="font-medium text-[var(--connectia-gold)] hover:underline"
        >
          Servicios
        </Link>
        .
      </p>

      {admin && (
        <p className="mt-3 text-sm text-gray-600">
          Eres administrador. Acceso rápido a{" "}
          <Link href="/admin" className="font-semibold text-[var(--connectia-gold)] hover:underline">
            Administrador
          </Link>
          .
        </p>
      )}
    </main>
  );
}

