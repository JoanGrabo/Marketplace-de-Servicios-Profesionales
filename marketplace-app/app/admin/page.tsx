import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { isAdmin } from "@/lib/admin";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/login");
  if (!isAdmin(user)) redirect("/");

  const services = await prisma.service.findMany({
    orderBy: [{ createdAt: "desc" }],
    take: 200,
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
        </div>
        <Link
          href="/mis-servicios"
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
        >
          Volver
        </Link>
      </div>

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
    </main>
  );
}

