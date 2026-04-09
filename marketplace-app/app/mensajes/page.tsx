import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getPublicProfileName } from "@/lib/publicProfile";
import ProfileAvatar from "./_components/ProfileAvatar";

export default async function MensajesPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/auth/login");
  }

  const conversations = await prisma.conversation.findMany({
    where: {
      OR: [{ clientId: user.id }, { professionalId: user.id }],
    },
    include: {
      service: { select: { id: true, title: true, slug: true } },
      client: {
        select: { id: true, displayName: true, avatarUrl: true, updatedAt: true },
      },
      professional: {
        select: { id: true, displayName: true, avatarUrl: true, updatedAt: true },
      },
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: { body: true, createdAt: true },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-[var(--connectia-bg)]">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:py-10">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-[var(--connectia-gray)] sm:text-3xl">
            Mensajes
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Tus conversaciones sobre servicios
          </p>
        </header>

        {conversations.length === 0 ? (
          <div className="rounded-2xl border border-gray-200/80 bg-white p-10 text-center shadow-sm">
            <p className="text-gray-600">
              Aún no tienes conversaciones. Contacta a un profesional desde un
              servicio para empezar.
            </p>
            <Link
              href="/servicios"
              className="mt-4 inline-block rounded-lg bg-[var(--connectia-gold)] px-5 py-2.5 text-sm font-semibold text-[var(--connectia-gray)] transition hover:opacity-90"
            >
              Ver servicios
            </Link>
          </div>
        ) : (
          <ul className="space-y-2">
            {conversations.map((c) => {
              const isClient = c.clientId === user.id;
              const otherProfile = isClient ? c.professional : c.client;
              const partnerName = getPublicProfileName(otherProfile);
              const last = c.messages[0];
              const preview = last?.body
                ? last.body.length > 72
                  ? `${last.body.slice(0, 70)}…`
                  : last.body
                : "Sin mensajes aún";

              return (
                <li key={c.id}>
                  <Link
                    href={`/mensajes/${c.id}`}
                    className="group flex gap-4 rounded-2xl border border-gray-200/80 bg-white p-4 shadow-sm transition hover:border-[var(--connectia-gold)]/40 hover:shadow-md"
                  >
                    <ProfileAvatar profile={otherProfile} size="lg" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="font-semibold text-[var(--connectia-gray)] group-hover:text-[var(--connectia-gold)]">
                            {partnerName}
                          </p>
                          <p className="mt-0.5 truncate text-xs font-medium text-gray-500">
                            {c.service.title}
                          </p>
                        </div>
                        {last && (
                          <time
                            className="shrink-0 text-xs text-gray-400"
                            dateTime={last.createdAt.toISOString()}
                          >
                            {last.createdAt.toLocaleDateString("es-ES", {
                              day: "numeric",
                              month: "short",
                            })}
                          </time>
                        )}
                      </div>
                      <p className="mt-2 line-clamp-2 text-sm text-gray-600">
                        {preview}
                      </p>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
