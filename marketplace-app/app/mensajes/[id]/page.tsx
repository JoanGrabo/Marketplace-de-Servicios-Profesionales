import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getPublicProfileName } from "@/lib/publicProfile";
import MessageComposer from "./MessageComposer";
import ProfileAvatar from "../_components/ProfileAvatar";

export default async function ConversationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) {
    redirect("/auth/login");
  }

  const conversation = await prisma.conversation.findUnique({
    where: { id },
    include: {
      service: { select: { id: true, title: true, slug: true } },
      client: {
        select: { id: true, displayName: true, avatarUrl: true },
      },
      professional: {
        select: { id: true, displayName: true, avatarUrl: true },
      },
      messages: {
        orderBy: { createdAt: "asc" },
        include: {
          sender: {
            select: { id: true, displayName: true, avatarUrl: true },
          },
        },
      },
    },
  });

  if (
    !conversation ||
    (conversation.clientId !== user.id &&
      conversation.professionalId !== user.id)
  ) {
    notFound();
  }

  // Marcar como leídos los mensajes recibidos en esta conversación.
  // (Solo los que vienen del otro usuario y aún no tienen readAt)
  await prisma.message
    .updateMany({
      where: {
        conversationId: conversation.id,
        readAt: null,
        senderId: { not: user.id },
      },
      data: { readAt: new Date() },
    })
    .catch(() => null);

  const isClient = conversation.clientId === user.id;
  const otherProfile = isClient
    ? conversation.professional
    : conversation.client;
  const partnerName = getPublicProfileName(otherProfile);

  return (
    <div className="flex min-h-screen flex-col bg-[var(--connectia-bg)]">
      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 py-6 sm:py-8">
        <header className="mb-4 shrink-0 rounded-2xl border border-gray-200/80 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex items-center gap-4">
            <ProfileAvatar profile={otherProfile} size="lg" />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                Hablando con
              </p>
              <h1 className="truncate text-lg font-bold text-[var(--connectia-gray)] sm:text-xl">
                {partnerName}
              </h1>
              <Link
                href={`/servicios/${encodeURIComponent(conversation.service.slug)}`}
                className="mt-1 inline-block truncate text-sm text-[var(--connectia-gold)] hover:underline"
              >
                {conversation.service.title}
              </Link>
            </div>
            <Link
              href="/mensajes"
              className="shrink-0 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              ← Bandeja
            </Link>
          </div>
        </header>

        <div className="flex min-h-0 flex-1 flex-col rounded-2xl border border-gray-200/80 bg-white shadow-sm">
          <div className="flex-1 space-y-3 overflow-y-auto p-4 sm:p-5">
            {conversation.messages.length === 0 ? (
              <p className="py-8 text-center text-sm text-gray-500">
                Escribe el primer mensaje para esta conversación.
              </p>
            ) : (
              conversation.messages.map((m) => {
                const mine = m.senderId === user.id;
                const senderLabel = mine
                  ? "Tú"
                  : getPublicProfileName(m.sender);
                return (
                  <div
                    key={m.id}
                    className={`flex ${mine ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[min(85%,28rem)] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
                        mine
                          ? "rounded-br-md bg-[var(--connectia-gold)]/25 text-[var(--connectia-gray)]"
                          : "rounded-bl-md border border-gray-100 bg-gray-50 text-gray-800"
                      }`}
                    >
                      <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                        {senderLabel}
                      </p>
                      <p className="whitespace-pre-wrap break-words">
                        {m.body}
                      </p>
                      <time
                        className="mt-1.5 block text-right text-[10px] text-gray-400"
                        dateTime={m.createdAt.toISOString()}
                      >
                        {m.createdAt.toLocaleString("es-ES", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </time>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="shrink-0 border-t border-gray-100 p-4 sm:p-5">
            <MessageComposer conversationId={conversation.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
