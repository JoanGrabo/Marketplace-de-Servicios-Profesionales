import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function MiPerfilPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/login");

  const profile = await prisma.profile.findUnique({
    where: { id: user.id },
  });

  async function updateProfile(formData: FormData) {
    "use server";
    const displayName = String(formData.get("displayName") ?? "").trim();
    const bio = String(formData.get("bio") ?? "").trim();
    const avatarUrl = String(formData.get("avatarUrl") ?? "").trim();

    await prisma.profile.update({
      where: { id: user.id },
      data: {
        displayName: displayName || null,
        bio: bio || null,
        avatarUrl: avatarUrl || null,
      },
    });

    redirect("/mi-perfil");
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="mb-2 text-3xl font-bold text-[var(--connectia-gray)]">
        Mi perfil
      </h1>
      <p className="mb-8 text-gray-600">
        Esta información se mostrará junto a los servicios que publiques.
      </p>

      <form
        action={updateProfile}
        className="space-y-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
      >
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Nombre público
          </label>
          <input
            name="displayName"
            defaultValue={profile?.displayName ?? ""}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-[var(--connectia-gold)] focus:outline-none focus:ring-1 focus:ring-[var(--connectia-gold)]"
            placeholder="Ej. Joan García"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Bio
          </label>
          <textarea
            name="bio"
            rows={3}
            defaultValue={profile?.bio ?? ""}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-[var(--connectia-gold)] focus:outline-none focus:ring-1 focus:ring-[var(--connectia-gold)]"
            placeholder="Cuenta brevemente quién eres y qué ofreces."
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            URL del avatar
          </label>
          <input
            name="avatarUrl"
            defaultValue={profile?.avatarUrl ?? ""}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-[var(--connectia-gold)] focus:outline-none focus:ring-1 focus:ring-[var(--connectia-gold)]"
            placeholder="https://ejemplo.com/mi-foto.jpg"
          />
          <p className="mt-1 text-xs text-gray-500">
            Más adelante podremos subir imágenes directamente; por ahora pega un enlace a una imagen.
          </p>
        </div>
        <button
          type="submit"
          className="rounded-lg bg-[var(--connectia-gold)] px-6 py-2 font-medium text-white transition hover:opacity-90"
        >
          Guardar perfil
        </button>
      </form>
    </main>
  );
}

