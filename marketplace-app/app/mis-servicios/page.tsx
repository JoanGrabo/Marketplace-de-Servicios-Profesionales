import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { validateServiceInput } from "@/lib/validation";

export const dynamic = "force-dynamic";

export default async function MisServiciosPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/login");

  const services = await prisma.service.findMany({
    where: { profileId: user.id },
    orderBy: { createdAt: "desc" },
    include: { profile: true },
  });

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="mb-2 text-3xl font-bold text-[var(--connectia-gray)]">
        Mis servicios
      </h1>
      <p className="mb-8 text-gray-600">
        Crea y gestiona los servicios que ofreces en CONNECTIA.
      </p>

      <form
        action={async (formData: FormData) => {
          "use server";
          const title = String(formData.get("title") ?? "");
          const description = String(formData.get("description") ?? "");
          const priceEuros = Number(formData.get("priceEuros") ?? 0);
          const deliveryDays = Number(formData.get("deliveryDays") ?? 7);

          const validation = validateServiceInput({
            title,
            description,
            priceEuros,
            deliveryDays,
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

          await prisma.service.create({
            data: {
              profileId: user.id,
              title: safe.title,
              slug,
              description: safe.description,
              priceCents: safe.priceCents,
              deliveryDays: safe.deliveryDays,
              active: true,
            },
          });

          redirect("/mis-servicios");
        }}
        className="mb-10 space-y-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
      >
        <h2 className="text-lg font-semibold text-[var(--connectia-gray)]">
          Crear nuevo servicio
        </h2>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Título
          </label>
          <input
            name="title"
            required
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-[var(--connectia-gold)] focus:outline-none focus:ring-1 focus:ring-[var(--connectia-gold)]"
            placeholder="Ej. Proyecto básico de vivienda"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Descripción
          </label>
          <textarea
            name="description"
            rows={3}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-[var(--connectia-gold)] focus:outline-none focus:ring-1 focus:ring-[var(--connectia-gold)]"
            placeholder="Cuenta qué incluye el servicio..."
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Precio (EUR)
            </label>
            <input
              name="priceEuros"
              type="number"
              min={1}
              step={1}
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-[var(--connectia-gold)] focus:outline-none focus:ring-1 focus:ring-[var(--connectia-gold)]"
              placeholder="100"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Días de entrega
            </label>
            <input
              name="deliveryDays"
              type="number"
              min={1}
              step={1}
              defaultValue={7}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-[var(--connectia-gold)] focus:outline-none focus:ring-1 focus:ring-[var(--connectia-gold)]"
            />
          </div>
        </div>
        <button
          type="submit"
          className="rounded-lg bg-[var(--connectia-gold)] px-6 py-2 font-medium text-white transition hover:opacity-90"
        >
          Guardar servicio
        </button>
      </form>

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
                    <div>{s.profile.email}</div>
                    <div>
                      {s.deliveryDays} {s.deliveryDays === 1 ? "día" : "días"}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
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

