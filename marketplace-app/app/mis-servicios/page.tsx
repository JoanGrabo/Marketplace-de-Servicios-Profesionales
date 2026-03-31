import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { validateServiceInput } from "@/lib/validation";
import { getPublicProfileName } from "@/lib/publicProfile";
import ServiceComposer from "@/app/mis-servicios/ServiceComposer";
import PromoteServiceButton from "@/app/mis-servicios/_components/PromoteServiceButton";

export const dynamic = "force-dynamic";

export default async function MisServiciosPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/login");

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

    // Después de publicar, llevamos al usuario a editar para “enganchar” el destacado.
    redirect(`/mis-servicios/editar/${created.id}?new=1`);
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="mb-2 text-3xl font-bold text-[var(--connectia-gray)]">
        Mis servicios
      </h1>
      <p className="mb-8 text-gray-600">
        Crea y gestiona los servicios que ofreces en CONNECTIA.
      </p>

      <div className="mb-10">
        <ServiceComposer sellerName={getPublicProfileName(user)} action={createService} />
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
                  {!s.isPromoted ? <PromoteServiceButton serviceId={s.id} /> : null}
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
    </main>
  );
}

