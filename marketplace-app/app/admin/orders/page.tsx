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
    status?: string;
    page?: string;
  };
};

const STATUSES = ["pending", "paid", "canceled", "failed"] as const;

export default async function AdminOrdersPage({ searchParams }: Props) {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/login");
  if (!isAdmin(user)) redirect("/");

  const q = String(searchParams?.q ?? "").trim();
  const status = String(searchParams?.status ?? "").trim();
  const pageRaw = String(searchParams?.page ?? "").trim();
  const page = Math.max(1, Number.isFinite(Number(pageRaw)) ? Math.floor(Number(pageRaw)) : 1);
  const perPage = 50;

  const where: Prisma.OrderWhereInput = {
    ...(STATUSES.includes(status as any) ? { status } : {}),
    ...(q
      ? {
          OR: [
            { id: { contains: q, mode: Prisma.QueryMode.insensitive } },
            { service: { title: { contains: q, mode: Prisma.QueryMode.insensitive } } },
            { buyer: { email: { contains: q, mode: Prisma.QueryMode.insensitive } } },
            { seller: { email: { contains: q, mode: Prisma.QueryMode.insensitive } } },
            { stripeCheckoutSessionId: { contains: q, mode: Prisma.QueryMode.insensitive } },
            { stripePaymentIntentId: { contains: q, mode: Prisma.QueryMode.insensitive } },
          ],
        }
      : {}),
  };

  const orders = await prisma.order.findMany({
    where,
    orderBy: [{ createdAt: "desc" }],
    take: perPage,
    skip: (page - 1) * perPage,
    include: {
      service: { select: { title: true, slug: true } },
      buyer: { select: { email: true, displayName: true } },
      seller: { select: { email: true, displayName: true } },
    },
  });

  function euro(amountCents: number) {
    return Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(amountCents / 100);
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[var(--connectia-gray)]">Administrador</h1>
          <p className="mt-2 text-sm text-gray-600">Orders: pagos de Stripe y estados.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href="/admin"
              className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
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
              className="rounded-full bg-[var(--connectia-gold)]/10 px-4 py-2 text-sm font-semibold text-[var(--connectia-gold)] ring-1 ring-[var(--connectia-gold)]/20"
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

      <form className="mb-6 grid gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:grid-cols-12 sm:items-end">
        <div className="sm:col-span-7">
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-500">
            Buscar
          </label>
          <input
            name="q"
            defaultValue={q}
            placeholder="Order id, servicio, email, stripe session/payment intent"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-[var(--connectia-gold)] focus:outline-none focus:ring-1 focus:ring-[var(--connectia-gold)]"
          />
        </div>
        <div className="sm:col-span-3">
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-500">
            Estado
          </label>
          <select
            name="status"
            defaultValue={status}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-[var(--connectia-gold)] focus:outline-none focus:ring-1 focus:ring-[var(--connectia-gold)]"
          >
            <option value="">Todos</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <input type="hidden" name="page" value="1" />
        <div className="flex gap-2 sm:col-span-2">
          <button
            type="submit"
            className="flex-1 rounded-lg bg-[var(--connectia-gold)] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Filtrar
          </button>
          <Link
            href="/admin/orders"
            className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            Limpiar
          </Link>
        </div>
      </form>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Servicio</th>
                <th className="px-4 py-3">Comprador / Vendedor</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3 text-right">Importe</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((o) => (
                <tr key={o.id} className="align-top">
                  <td className="px-4 py-3">
                    <div className="font-semibold text-[var(--connectia-gray)]">{o.id}</div>
                    <div className="mt-1 text-xs text-gray-500">
                      {o.createdAt.toLocaleString("es-ES", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                    {o.stripeCheckoutSessionId ? (
                      <div className="mt-2 text-xs text-gray-500">
                        session: <span className="font-mono">{o.stripeCheckoutSessionId}</span>
                      </div>
                    ) : null}
                    {o.stripePaymentIntentId ? (
                      <div className="mt-1 text-xs text-gray-500">
                        pi: <span className="font-mono">{o.stripePaymentIntentId}</span>
                      </div>
                    ) : null}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/servicios/${encodeURIComponent(o.service.slug)}`}
                      className="font-semibold text-[var(--connectia-gray)] hover:underline"
                    >
                      {o.service.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-700">
                    <div>
                      <span className="font-semibold text-gray-800">Buyer:</span> {o.buyer.email}
                    </div>
                    <div>
                      <span className="font-semibold text-gray-800">Seller:</span> {o.seller.email}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ring-1 ${
                        o.status === "paid"
                          ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                          : o.status === "pending"
                            ? "bg-amber-50 text-amber-800 ring-amber-200"
                            : o.status === "canceled"
                              ? "bg-gray-100 text-gray-700 ring-gray-200"
                              : "bg-red-50 text-red-700 ring-red-200"
                      }`}
                    >
                      {o.status}
                    </span>
                    {o.paidAt ? (
                      <div className="mt-1 text-xs text-gray-500">
                        pagado:{" "}
                        {o.paidAt.toLocaleString("es-ES", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                      </div>
                    ) : null}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="font-semibold text-[var(--connectia-gray)]">{euro(o.amountCents)}</div>
                    <div className="text-xs text-gray-500">{o.currency}</div>
                  </td>
                </tr>
              ))}
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                    No hay orders.
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
              href={`/admin/orders?${new URLSearchParams({
                ...(q ? { q } : {}),
                ...(status ? { status } : {}),
                page: String(page - 1),
              }).toString()}`}
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
            href={`/admin/orders?${new URLSearchParams({
              ...(q ? { q } : {}),
              ...(status ? { status } : {}),
              page: String(page + 1),
            }).toString()}`}
            className="rounded-lg bg-[var(--connectia-gold)] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Siguiente
          </Link>
        </div>
      </div>
    </main>
  );
}

