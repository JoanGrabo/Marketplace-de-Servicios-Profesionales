import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { isAdmin } from "@/lib/admin";
import { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

type Props = {
  searchParams?: {
    q?: string;
    page?: string;
  };
};

export default async function AdminPage({ searchParams }: Props) {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/login");
  if (!isAdmin(user)) redirect("/");

  const q = String(searchParams?.q ?? "").trim();
  const pageRaw = String(searchParams?.page ?? "").trim();
  const page = Math.max(1, Number.isFinite(Number(pageRaw)) ? Math.floor(Number(pageRaw)) : 1);
  const perPage = 50;

  const services = await prisma.service.findMany({
    where: q
      ? {
          OR: [
            { title: { contains: q, mode: Prisma.QueryMode.insensitive } },
            { profile: { email: { contains: q, mode: Prisma.QueryMode.insensitive } } },
            { profile: { displayName: { contains: q, mode: Prisma.QueryMode.insensitive } } },
          ],
        }
      : undefined,
    orderBy: [{ createdAt: "desc" }],
    take: perPage,
    skip: (page - 1) * perPage,
    include: {
      profile: { select: { id: true, email: true, displayName: true } },
    },
  });

  async function deleteService(formData: FormData) {
    "use server";
    const current = await getCurrentUser();
    if (!current) redirect("/auth/login");
    if (!isAdmin(current)) redirect("/");

    const id = String(formData.get("id") ?? "").trim();
    if (!id) return;

    await prisma.service.deleteMany({ where: { id } });
    redirect("/admin");
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[var(--connectia-gray)]">Administrador</h1>
          <p className="mt-2 text-sm text-gray-600">
            Control básico: listar y borrar servicios de cualquier usuario.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href="/admin"
              className="rounded-full bg-[var(--connectia-gold)]/10 px-4 py-2 text-sm font-semibold text-[var(--connectia-gold)] ring-1 ring-[var(--connectia-gold)]/20"
            >
              Servicios
            </Link>
            <Link
              href="/admin/mensajes"
              className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              Mensajes
            </Link>
            <Link
              href="/admin/orders"
              className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              Orders
            </Link>
          </div>
        </div>
        <Link
          href="/mis-servicios"
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
        >
          Volver
        </Link>
      </div>

      <form className="mb-6 flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center">
        <input
          name="q"
          defaultValue={q}
          placeholder="Buscar por título, email o nombre"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-[var(--connectia-gold)] focus:outline-none focus:ring-1 focus:ring-[var(--connectia-gold)]"
        />
        <input type="hidden" name="page" value="1" />
        <button
          type="submit"
          className="rounded-lg bg-[var(--connectia-gold)] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
        >
          Buscar
        </button>
        <Link href="/admin" className="text-sm font-semibold text-gray-600 hover:underline">
          Limpiar
        </Link>
      </form>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-4 py-3">Servicio</th>
                <th className="px-4 py-3">Propietario</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {services.map((s) => (
                <tr key={s.id} className="align-top">
                  <td className="px-4 py-3">
                    <Link
                      href={`/servicios/${encodeURIComponent(s.slug)}`}
                      className="font-semibold text-[var(--connectia-gray)] hover:underline"
                    >
                      {s.title}
                    </Link>
                    <div className="mt-1 text-xs text-gray-500">{s.id}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-800">{s.profile.displayName ?? "—"}</div>
                    <div className="text-xs text-gray-500">{s.profile.email}</div>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-600">
                    <div>{s.active ? "Activo" : "Inactivo"}</div>
                    <div>{s.isPromoted ? "Destacado" : "Normal"}</div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <form action={deleteService} className="inline-flex">
                      <input type="hidden" name="id" value={s.id} />
                      <button
                        type="submit"
                        className="rounded-lg border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold text-red-700 transition hover:bg-red-100"
                      >
                        Borrar
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
              {services.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                    No hay servicios.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between gap-3">
        <div className="text-sm text-gray-500">Página {page}</div>
        <div className="flex gap-2">
          {page > 1 ? (
            <Link
              href={`/admin?${new URLSearchParams({ ...(q ? { q } : {}), page: String(page - 1) }).toString()}`}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              Anterior
            </Link>
          ) : (
            <span className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-semibold text-gray-400">
              Anterior
            </span>
          )}
          <Link
            href={`/admin?${new URLSearchParams({ ...(q ? { q } : {}), page: String(page + 1) }).toString()}`}
            className="rounded-lg bg-[var(--connectia-gold)] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Siguiente
          </Link>
        </div>
      </div>
    </main>
  );
}

