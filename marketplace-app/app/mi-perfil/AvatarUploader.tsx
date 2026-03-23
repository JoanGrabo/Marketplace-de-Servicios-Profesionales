"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  initialAvatarUrl: string;
};

export default function AvatarUploader({ initialAvatarUrl }: Props) {
  const router = useRouter();
  const [avatarUrl, setAvatarUrl] = useState(initialAvatarUrl);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onChangeAvatar(file: File | null) {
    if (!file) return;
    setError(null);
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("avatar", file);
      const res = await fetch("/api/profile/avatar", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.message ?? "No se pudo subir la imagen.");
        setUploading(false);
        return;
      }
      setAvatarUrl(data.avatarUrl as string);
      setUploading(false);
      router.refresh();
    } catch {
      setError("Error inesperado al subir la imagen.");
      setUploading(false);
    }
  }

  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700">Foto de perfil (opcional)</label>
      <div className="flex items-center gap-3">
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={avatarUrl}
            alt="Avatar"
            className="h-14 w-14 rounded-full object-cover ring-1 ring-gray-200"
          />
        ) : (
          <div className="h-14 w-14 rounded-full bg-gray-100 ring-1 ring-gray-200" />
        )}
        <label className="inline-flex cursor-pointer rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50">
          {uploading ? "Subiendo..." : "Subir imagen"}
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            disabled={uploading}
            onChange={(e) => void onChangeAvatar(e.target.files?.[0] ?? null)}
          />
        </label>
      </div>
      <p className="mt-1 text-xs text-gray-500">Formatos permitidos: JPG, PNG, WEBP. Máximo 3MB.</p>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
