import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function MensajesPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/auth/login?next=/mensajes");
  }

  const conversations = await prisma.conversation.findMany({
    where: {
      OR: [{ clientId: user.id }, { professionalId: user.id }],
    },
    include: {
      service: {
        select: {
          slug: true,
          title: true,
        },
      },
      client: {
        select: {
          id: true,
          email: true,
        },
      },
      professional: {
        select: {
          id: true,
          email: true,
        },
      },
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: {
          body: true,
          createdAt: true,
          senderId: true,
        },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="mb-2 text-3xl font-bold text-[var(--connectia-gray)]">Mensajes</h1>
      <p className="mb-8 text-gray-600">Gestiona tus conversaciones con clientes y profesionales.</p>

      {conversations.length === 0 ? (
        <p className="text-gray-500">
          Aún no tienes conversaciones. Desde cualquier servicio puedes pulsar en contactar.
        </p>
      ) : (
        <ul className="space-y-3">
          {conversations.map((c) => {
            const otherUser = c.client.id === user.id ? c.professional : c.client;
            const lastMessage = c.messages[0];
            return (
              <li key={c.id} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                <Link href={`/mensajes/${c.id}`} className="block">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Servicio</p>
                      <p className="font-semibold text-[var(--connectia-gray)]">{c.service.title}</p>
                      <p className="mt-1 text-sm text-gray-600">Con: {otherUser.email}</p>
                      {lastMessage && (
                        <p className="mt-2 line-clamp-1 text-sm text-gray-500">{lastMessage.body}</p>
                      )}
                    </div>
                    <span className="text-xs text-gray-500">
                      {lastMessage
                        ? new Intl.DateTimeFormat("es-ES", {
                            day: "2-digit",
                            month: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                          }).format(lastMessage.createdAt)
                        : ""}
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
