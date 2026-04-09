import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import AvatarUploader from "../AvatarUploader";

export const dynamic = "force-dynamic";

export default async function MiPerfilEditarPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/login");

  const profile = await prisma.profile.findUnique({
    where: { id: user.id },
  });

  async function updateProfile(formData: FormData) {
    "use server";
    const current = await getCurrentUser();
    if (!current) {
      redirect("/auth/login");
    }

    const displayName = String(formData.get("displayName") ?? "").trim();
    const headline = String(formData.get("headline") ?? "").trim();
    const bio = String(formData.get("bio") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();
    const websiteUrl = String(formData.get("websiteUrl") ?? "").trim();
    const linkedinUrl = String(formData.get("linkedinUrl") ?? "").trim();
    const instagramUrl = String(formData.get("instagramUrl") ?? "").trim();
    const xUrl = String(formData.get("xUrl") ?? "").trim();
    const colegiadoNumber = String(formData.get("colegiadoNumber") ?? "").trim();
    const city = String(formData.get("city") ?? "").trim();
    const languages = String(formData.get("languages") ?? "").trim();
    const yearsExperienceRaw = String(formData.get("yearsExperience") ?? "").trim();
    const yearsExperienceNum = Number(yearsExperienceRaw);
    const yearsExperience =
      yearsExperienceRaw && Number.isFinite(yearsExperienceNum) && yearsExperienceNum >= 0
        ? Math.floor(yearsExperienceNum)
        : null;

    await prisma.profile.update({
      where: { id: current.id },
      data: {
        displayName: displayName || null,
        headline: headline || null,
        bio: bio || null,
        phone: phone || null,
        websiteUrl: websiteUrl || null,
        linkedinUrl: linkedinUrl || null,
        instagramUrl: instagramUrl || null,
        xUrl: xUrl || null,
        colegiadoNumber: colegiadoNumber || null,
        city: city || null,
        languages: languages || null,
        yearsExperience,
      },
    });

    redirect("/mi-perfil");
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="mb-2 text-3xl font-bold text-[var(--connectia-gray)]">Editar mi perfil</h1>
          <p className="text-gray-600">
            Completa tu perfil para generar más confianza y mejorar tu conversión cuando publiques servicios.
          </p>
        </div>
        <Link
          href="/mi-perfil"
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
        >
          Ver mi perfil →
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <aside className="space-y-4 lg:col-span-1">
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--connectia-gold)]">Vista rápida</p>
            <div className="mt-4 flex items-center gap-3">
              {profile?.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={`${profile.avatarUrl}${profile.updatedAt ? `${profile.avatarUrl.includes("?") ? "&" : "?"}v=${profile.updatedAt.getTime()}` : ""}`}
                  alt="Avatar"
                  className="h-14 w-14 rounded-full object-cover ring-1 ring-gray-200"
                />
              ) : (
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-lg font-semibold text-gray-500 ring-1 ring-gray-200">
                  {(profile?.displayName || user.email).charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <p className="font-semibold text-[var(--connectia-gray)]">{profile?.displayName || user.email}</p>
                <p className="text-xs text-gray-500">{profile?.headline || "Sin titular profesional"}</p>
              </div>
            </div>
            <dl className="mt-4 space-y-2 text-sm text-gray-600">
              <div className="flex items-center justify-between">
                <dt>Email</dt>
                <dd className="font-medium text-gray-700">{user.email}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt>Rol</dt>
                <dd className="font-medium capitalize text-gray-700">{user.role}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt>Ciudad</dt>
                <dd className="font-medium text-gray-700">{profile?.city || "No indicada"}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-[var(--connectia-gray)]">Información extra</p>
            <div className="mt-3 space-y-2 text-sm">
              <Link href="/quienes-somos" className="block text-[var(--connectia-gold)] hover:underline">
                Quiénes somos
              </Link>
              <Link href="/contacto" className="block text-[var(--connectia-gold)] hover:underline">
                Contacto
              </Link>
              <Link href="/mensajes" className="block text-[var(--connectia-gold)] hover:underline">
                Ir a mensajes
              </Link>
            </div>
          </div>
        </aside>

        <form
          action={updateProfile}
          className="space-y-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm lg:col-span-2"
        >
          <h2 className="text-lg font-semibold text-[var(--connectia-gray)]">Perfil profesional</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Nombre público</label>
              <input
                name="displayName"
                defaultValue={profile?.displayName ?? ""}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-[var(--connectia-gold)] focus:outline-none focus:ring-1 focus:ring-[var(--connectia-gold)]"
                placeholder="Ej. Joan García"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Titular profesional (opcional)</label>
              <input
                name="headline"
                defaultValue={profile?.headline ?? ""}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-[var(--connectia-gold)] focus:outline-none focus:ring-1 focus:ring-[var(--connectia-gold)]"
                placeholder="Ej. Arquitecto especializado en rehabilitación"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Bio</label>
            <textarea
              name="bio"
              rows={4}
              defaultValue={profile?.bio ?? ""}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-[var(--connectia-gold)] focus:outline-none focus:ring-1 focus:ring-[var(--connectia-gold)]"
              placeholder="Cuenta brevemente quién eres, tu experiencia y qué tipo de trabajos realizas."
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Ciudad (opcional)</label>
              <input
                name="city"
                defaultValue={profile?.city ?? ""}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-[var(--connectia-gold)] focus:outline-none focus:ring-1 focus:ring-[var(--connectia-gold)]"
                placeholder="Ej. Madrid"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Años de experiencia (opcional)</label>
              <input
                name="yearsExperience"
                type="number"
                min={0}
                step={1}
                defaultValue={profile?.yearsExperience ?? ""}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-[var(--connectia-gold)] focus:outline-none focus:ring-1 focus:ring-[var(--connectia-gold)]"
                placeholder="Ej. 8"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Idiomas (opcional)</label>
              <input
                name="languages"
                defaultValue={profile?.languages ?? ""}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-[var(--connectia-gold)] focus:outline-none focus:ring-1 focus:ring-[var(--connectia-gold)]"
                placeholder="Ej. Español, Inglés"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Teléfono (opcional)</label>
              <input
                name="phone"
                defaultValue={profile?.phone ?? ""}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-[var(--connectia-gold)] focus:outline-none focus:ring-1 focus:ring-[var(--connectia-gold)]"
                placeholder="Ej. +34 600 000 000"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Web/Portfolio (opcional)</label>
            <input
              name="websiteUrl"
              defaultValue={profile?.websiteUrl ?? ""}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-[var(--connectia-gold)] focus:outline-none focus:ring-1 focus:ring-[var(--connectia-gold)]"
              placeholder="https://mi-portfolio.com"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">LinkedIn (opcional)</label>
              <input
                name="linkedinUrl"
                defaultValue={(profile as any)?.linkedinUrl ?? ""}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-[var(--connectia-gold)] focus:outline-none focus:ring-1 focus:ring-[var(--connectia-gold)]"
                placeholder="https://www.linkedin.com/in/tu-perfil"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Instagram (opcional)</label>
              <input
                name="instagramUrl"
                defaultValue={(profile as any)?.instagramUrl ?? ""}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-[var(--connectia-gold)] focus:outline-none focus:ring-1 focus:ring-[var(--connectia-gold)]"
                placeholder="https://instagram.com/tu_usuario"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">X / Twitter (opcional)</label>
              <input
                name="xUrl"
                defaultValue={(profile as any)?.xUrl ?? ""}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-[var(--connectia-gold)] focus:outline-none focus:ring-1 focus:ring-[var(--connectia-gold)]"
                placeholder="https://x.com/tu_usuario"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Nº de colegiado (opcional)</label>
              <input
                name="colegiadoNumber"
                defaultValue={(profile as any)?.colegiadoNumber ?? ""}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-[var(--connectia-gold)] focus:outline-none focus:ring-1 focus:ring-[var(--connectia-gold)]"
                placeholder="Ej. 12345"
              />
            </div>
          </div>

          <AvatarUploader initialAvatarUrl={profile?.avatarUrl ?? ""} />

          <button
            type="submit"
            className="rounded-lg bg-[var(--connectia-gold)] px-6 py-2 font-medium text-white transition hover:opacity-90"
          >
            Guardar perfil
          </button>
        </form>
      </div>
    </main>
  );
}

