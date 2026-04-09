import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { isAdmin } from "@/lib/admin";
import { getPublicProfileName } from "@/lib/publicProfile";

export const dynamic = "force-dynamic";

export default async function AdminConversationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/login");
  if (!isAdmin(user)) redirect("/");

  const { id } = await params;

  const conversation = await prisma.conversation.findUnique({
    where: { id },
    include: {
      service: { select: { title: true, slug: true } },
      client: { select: { id: true, email: true, displayName: true, avatarUrl: true, updatedAt: true } },
      professional: { select: { id: true, email: true, displayName: true, avatarUrl: true, updatedAt: true } },
      messages: {
        orderBy: { createdAt: "asc" },
        include: { sender: { select: { id: true, email: true, displayName: true, avatarUrl: true, updatedAt: true } } },
      },
    },
  });

  if (!conversation) notFound();

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[var(--connectia-gray)] sm:text-3xl">
            Conversación (admin)
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Servicio:{" "}
            <Link
              href={`/servicios/${encodeURIComponent(conversation.service.slug)}`}
              className="font-semibold text-[var(--connectia-gold)] hover:underline"
            >
              {conversation.service.title}
            </Link>
          </p>
          <p className="mt-2 text-xs text-gray-500">{conversation.id}</p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin/mensajes"
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            ← Volver
          </Link>
        </div>
      </div>

      <div className="mb-6 grid gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Cliente</p>
          <p className="mt-1 font-semibold text-[var(--connectia-gray)]">
            {getPublicProfileName(conversation.client)}
          </p>
          <p className="text-sm text-gray-600">{conversation.client.email}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Profesional</p>
          <p className="mt-1 font-semibold text-[var(--connectia-gray)]">
            {getPublicProfileName(conversation.professional)}
          </p>
          <p className="text-sm text-gray-600">{conversation.professional.email}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="space-y-3 p-4 sm:p-6">
          {conversation.messages.length === 0 ? (
            <p className="py-10 text-center text-sm text-gray-500">Sin mensajes.</p>
          ) : (
            conversation.messages.map((m) => {
              const senderName = getPublicProfileName(m.sender);
              return (
                <article key={m.id} className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-[var(--connectia-gray)]">
                        {senderName} <span className="font-normal text-gray-500">({m.sender.email})</span>
                      </p>
                      <p className="mt-0.5 text-xs text-gray-500">
                        {m.createdAt.toLocaleString("es-ES", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-semibold ring-1 ${
                        m.readAt
                          ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                          : "bg-amber-50 text-amber-800 ring-amber-200"
                      }`}
                      title={m.readAt ? `Leído: ${m.readAt.toLocaleString("es-ES")}` : "No leído"}
                    >
                      {m.readAt ? "Leído" : "No leído"}
                    </span>
                  </div>
                  <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-gray-800">
                    {m.body}
                  </p>
                </article>
              );
            })
          )}
        </div>
      </div>
    </main>
  );
}

