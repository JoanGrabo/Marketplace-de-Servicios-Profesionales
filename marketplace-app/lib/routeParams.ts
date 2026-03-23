/**
 * Next.js 15+ puede pasar `params` como Promise en páginas y route handlers.
 * Este helper funciona también en Next 14 (params síncrono).
 */
export async function resolveRouteParams<T extends Record<string, string | string[] | undefined>>(
  params: T | Promise<T>,
): Promise<T> {
  return Promise.resolve(params);
}

/** Decodifica un segmento de URL de forma segura (no lanza si el % está mal formado). */
export function safeDecodeURIComponent(segment: string): string {
  try {
    return decodeURIComponent(segment);
  } catch {
    return segment;
  }
}
