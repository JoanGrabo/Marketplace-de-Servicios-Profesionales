import { COOKIE_NAME } from "@/lib/auth";

function cookieBaseAttrs(maxAgeSeconds: number): string {
  const maxAge = Math.max(0, Math.floor(maxAgeSeconds));
  const expires = new Date(Date.now() + maxAge * 1000).toUTCString();
  return `Path=/; Expires=${expires}; Max-Age=${maxAge}; HttpOnly; SameSite=Lax`;
}

export function buildSessionSetCookie(token: string, maxAgeSeconds: number): string {
  return `${COOKIE_NAME}=${encodeURIComponent(token)}; ${cookieBaseAttrs(maxAgeSeconds)}`;
}

export function buildSessionClearCookie(): string {
  return `${COOKIE_NAME}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Max-Age=0; HttpOnly; SameSite=Lax`;
}
