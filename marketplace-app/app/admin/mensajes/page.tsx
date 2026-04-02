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

export default async function AdminMensajesPage({ searchParams }: Props) {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/login");
  if (!isAdmin(user)) redirect("/");

  const q = String(searchParams?.q ?? "").trim();
  const pageRaw = String(searchParams?.page ?? "").trim();
  const page = Math.max(1, Number.isFinite(Number(pageRaw)) ? Math.floor(Number(pageRaw)) : 1);
  const perPage = 50;

  const where: Prisma.ConversationWhereInput | undefined = q
    ? {
        OR: [
          { service: { title: { contains: q, mode: Prisma.QueryMode.insensitive } } },
          { client: { email: { contains: q, mode: Prisma.QueryMode.insensitive } } },
          { professional: { email: { contains: q, mode: Prisma.QueryMode.insensitive } } },
          { client: { displayName: { contains: q, mode: Prisma.QueryMode.insensitive } } },
          { professional: { displayName: { contains: q, mode: Prisma.QueryMode.insensitive } } },
        ],
      }
    : undefined;

  const conversations = await prisma.conversation.findMany({
    where,
    orderBy: [{ updatedAt: "desc" }],
    take: perPage,
    skip: (page - 1) * perPage,
    include: {
      service: { select: { title: true, slug: true } },
      client: { select: { id: true, email: true, displayName: true } },
      professional: { select: { id: true, email: true, displayName: true } },
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: { body: true, createdAt: true, senderId: true, readAt: true },
      },
    },
  });

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[var(--connectia-gray)]">Administrador</h1>
          <p className="mt-2 text-sm text-gray-600">
            Mensajes: conversaciones y último mensaje.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href="/admin"
              className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              Servicios
            </Link>
            <Link
              href="/admin/mensajes"
              className="rounded-full bg-[var(--connectia-gold)]/10 px-4 py-2 text-sm font-semibold text-[var(--connectia-gold)] ring-1 ring-[var(--connectia-gold)]/20"
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
          href="/admin"
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
        >
          Volver a servicios
        </Link>
      </div>

      <form className="mb-6 flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center">
        <input
          name="q"
          defaultValue={q}
          placeholder="Buscar por servicio o email/nombre"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-[var(--connectia-gold)] focus:outline-none focus:ring-1 focus:ring-[var(--connectia-gold)]"
        />
        <input type="hidden" name="page" value="1" />
        <button
          type="submit"
          className="rounded-lg bg-[var(--connectia-gold)] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
        >
          Buscar
        </button>
        <Link href="/admin/mensajes" className="text-sm font-semibold text-gray-600 hover:underline">
          Limpiar
        </Link>
      </form>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-4 py-3">Conversación</th>
                <th className="px-4 py-3">Participantes</th>
                <th className="px-4 py-3">Último mensaje</th>
                <th className="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {conversations.map((c) => {
                const last = c.messages[0];
                const preview = last?.body
                  ? last.body.length > 120
                    ? `${last.body.slice(0, 117)}…`
                    : last.body
                  : "—";
                return (
                  <tr key={c.id} className="align-top">
                    <td className="px-4 py-3">
                      <div className="font-semibold text-[var(--connectia-gray)]">{c.service.title}</div>
                      <div className="mt-1 text-xs text-gray-500">{c.id}</div>
                      <Link
                        href={`/servicios/${encodeURIComponent(c.service.slug)}`}
                        className="mt-2 inline-block text-xs font-semibold text-[var(--connectia-gold)] hover:underline"
                      >
                        Ver servicio →
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-700">
                      <div className="font-semibold text-gray-800">Cliente</div>
                      <div>{c.client.displayName ?? "—"}</div>
                      <div className="text-gray-500">{c.client.email}</div>
                      <div className="mt-3 font-semibold text-gray-800">Profesional</div>
                      <div>{c.professional.displayName ?? "—"}</div>
                      <div className="text-gray-500">{c.professional.email}</div>
                    </td>
                    <td className="px-4 py-3">
                      {last ? (
                        <>
                          <div className="text-xs text-gray-500">
                            {last.createdAt.toLocaleString("es-ES", {
                              day: "numeric",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                            {" · "}
                            {last.readAt ? "Leído" : "No leído"}
                          </div>
                          <div className="mt-2 line-clamp-3 text-sm text-gray-700">{preview}</div>
                        </>
                      ) : (
                        <div className="text-sm text-gray-500">Sin mensajes aún.</div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/admin/mensajes/${encodeURIComponent(c.id)}`}
                        className="rounded-lg border border-gray-300 px-3 py-1 text-xs font-semibold text-gray-700 transition hover:bg-gray-50"
                      >
                        Abrir
                      </Link>
                    </td>
                  </tr>
                );
              })}
              {conversations.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                    No hay conversaciones.
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
              href={`/admin/mensajes?${new URLSearchParams({ ...(q ? { q } : {}), page: String(page - 1) }).toString()}`}
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
            href={`/admin/mensajes?${new URLSearchParams({ ...(q ? { q } : {}), page: String(page + 1) }).toString()}`}
            className="rounded-lg bg-[var(--connectia-gold)] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Siguiente
          </Link>
        </div>
      </div>
    </main>
  );
}

