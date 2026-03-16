import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

type Params = {
  params: {
    id: string;
  };
};

export const dynamic = "force-dynamic";

export default async function EditarServicioPage({ params }: Params) {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/login");

  const servicio = await prisma.service.findFirst({
    where: {
      id: params.id,
      profileId: user.id,
    },
  });

  if (!servicio) {
    redirect("/mis-servicios");
  }

  async function updateService(formData: FormData) {
    "use server";
    const current = await getCurrentUser();
    if (!current) redirect("/auth/login");

    const title = String(formData.get("title") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();
    const priceEuros = Number(formData.get("priceEuros") ?? 0);
    const deliveryDays = Number(formData.get("deliveryDays") ?? 7);

    if (!title || !priceEuros || Number.isNaN(priceEuros)) {
      return;
    }

    await prisma.service.updateMany({
      where: { id: servicio.id, profileId: current.id },
      data: {
        title,
        description: description || null,
        priceCents: Math.round(priceEuros * 100),
        deliveryDays: Number.isNaN(deliveryDays) ? 7 : deliveryDays,
      },
    });

    redirect("/mis-servicios");
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="mb-2 text-3xl font-bold text-[var(--connectia-gray)]">
        Editar servicio
      </h1>
      <p className="mb-8 text-gray-600">
        Actualiza la información de tu servicio.
      </p>

      <form
        action={updateService}
        className="space-y-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
      >
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Título
          </label>
          <input
            name="title"
            defaultValue={servicio.title}
            required
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-[var(--connectia-gold)] focus:outline-none focus:ring-1 focus:ring-[var(--connectia-gold)]"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Descripción
          </label>
          <textarea
            name="description"
            rows={4}
            defaultValue={servicio.description ?? ""}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-[var(--connectia-gold)] focus:outline-none focus:ring-1 focus:ring-[var(--connectia-gold)]"
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
              defaultValue={Math.round(servicio.priceCents / 100)}
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-[var(--connectia-gold)] focus:outline-none focus:ring-1 focus:ring-[var(--connectia-gold)]"
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
              defaultValue={servicio.deliveryDays}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-[var(--connectia-gold)] focus:outline-none focus:ring-1 focus:ring-[var(--connectia-gold)]"
            />
          </div>
        </div>
        <div className="flex gap-3">
          <button
            type="submit"
            className="rounded-lg bg-[var(--connectia-gold)] px-6 py-2 font-medium text-white transition hover:opacity-90"
          >
            Guardar cambios
          </button>
          <a
            href="/mis-servicios"
            className="rounded-lg border border-gray-300 px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </a>
        </div>
      </form>
    </main>
  );
}

