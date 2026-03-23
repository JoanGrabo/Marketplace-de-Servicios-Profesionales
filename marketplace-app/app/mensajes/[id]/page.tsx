import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import MessageComposer from "./MessageComposer";

type Params = {
  params: {
    id: string;
  };
};

export const dynamic = "force-dynamic";

export default async function ConversationPage({ params }: Params) {
  const user = await getCurrentUser();
  if (!user) {
    redirect(`/auth/login?next=${encodeURIComponent(`/mensajes/${params.id}`)}`);
  }

  const conversation = await prisma.conversation.findUnique({
    where: { id: params.id },
    include: {
      service: {
        select: {
          title: true,
          slug: true,
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
        orderBy: { createdAt: "asc" },
        include: {
          sender: {
            select: {
              id: true,
              email: true,
            },
          },
        },
      },
    },
  });

  if (!conversation) {
    notFound();
  }

  const canAccess = conversation.client.id === user.id || conversation.professional.id === user.id;
  if (!canAccess) {
    notFound();
  }

  const otherUser = conversation.client.id === user.id ? conversation.professional : conversation.client;
  const otherUserId = conversation.client.id === user.id ? conversation.professional.id : conversation.client.id;

  await prisma.message.updateMany({
    where: {
      conversationId: conversation.id,
      senderId: otherUserId,
      readAt: null,
    },
    data: { readAt: new Date() },
  });

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <p className="mb-4 text-sm text-gray-500">
        <Link href="/mensajes" className="hover:underline">
          Volver a mensajes
        </Link>
      </p>
      <div className="mb-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <p className="text-sm text-gray-500">Servicio</p>
        <p className="font-semibold text-[var(--connectia-gray)]">{conversation.service.title}</p>
        <p className="text-sm text-gray-600">Con: {otherUser.email}</p>
        <Link
          href={`/servicios/${conversation.service.slug}`}
          className="mt-2 inline-block text-sm font-medium text-[var(--connectia-gold)] hover:underline"
        >
          Ver servicio
        </Link>
      </div>

      <section className="mb-4 space-y-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        {conversation.messages.length === 0 ? (
          <p className="text-sm text-gray-500">No hay mensajes todavía.</p>
        ) : (
          conversation.messages.map((m) => {
            const isMine = m.sender.id === user.id;
            return (
              <div
                key={m.id}
                className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                  isMine
                    ? "ml-auto bg-[var(--connectia-gold)] text-white"
                    : "mr-auto bg-gray-100 text-gray-800"
                }`}
              >
                <p className="whitespace-pre-wrap">{m.body}</p>
                <p
                  className={`mt-1 text-[11px] ${
                    isMine ? "text-white/80" : "text-gray-500"
                  }`}
                >
                  {new Intl.DateTimeFormat("es-ES", {
                    day: "2-digit",
                    month: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  }).format(m.createdAt)}
                </p>
              </div>
            );
          })
        )}
      </section>

      <MessageComposer conversationId={conversation.id} />
    </main>
  );
}
