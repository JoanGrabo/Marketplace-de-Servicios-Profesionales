/**
 * En BD guardamos rutas `/uploads/services/<archivo>`. El preview en mis-servicios
 * usa `/api/uploads/services/<archivo>` para que la imagen cargue igual que tras
 * subir (y en algunos entornos solo el handler responde bien para ficheros en
 * runtime). El catálogo debe usar la misma resolución.
 */
export function resolveServiceThumbnailSrc(
  thumbnailUrl: string | null | undefined,
): string | null {
  const raw = (thumbnailUrl ?? "").trim();
  if (!raw) return null;
  if (raw.startsWith("http://") || raw.startsWith("https://")) return raw;
  if (raw.startsWith("/api/uploads/services/")) return raw;
  if (raw.startsWith("/uploads/services/")) {
    const filename = raw.split("/").filter(Boolean).pop() ?? "";
    if (!filename) return raw;
    return `/api/uploads/services/${filename}`;
  }
  return raw.startsWith("/") ? raw : `/${raw}`;
}
