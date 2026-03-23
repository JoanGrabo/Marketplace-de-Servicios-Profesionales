import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "./db";
import type { Profile } from "@prisma/client";

export const COOKIE_NAME = "connectia_session";

export function shouldUseSecureCookies(): boolean {
  const baseUrl = process.env.APP_BASE_URL ?? "";
  if (baseUrl.toLowerCase().startsWith("https://")) {
    return true;
  }
  return false;
}

function getJwtSecret(): string {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV !== "production") {
      return "connectia_dev_only_secret_change_me";
    }
    throw new Error(
      "AUTH_SECRET no está configurado. Define esta variable para habilitar autenticación segura."
    );
  }
  return secret;
}

export type SessionPayload = {
  userId: string;
  email: string;
  role: string;
};

function getSessionDays(remember: boolean): number {
  const fallback = remember ? 30 : 7;
  const raw = remember
    ? process.env.SESSION_DAYS_REMEMBER
    : process.env.SESSION_DAYS_DEFAULT;
  const parsed = Number(raw ?? "");
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return fallback;
  }
  return Math.floor(parsed);
}

export function getSessionMaxAgeSeconds(remember = false): number {
  return getSessionDays(remember) * 24 * 60 * 60;
}

export function createSessionToken(user: Profile, options?: { remember?: boolean }): string {
  const remember = options?.remember ?? false;
  const payload: SessionPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  return jwt.sign(payload, getJwtSecret(), {
    expiresIn: `${getSessionDays(remember)}d`,
  });
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const payload = jwt.verify(token, getJwtSecret()) as SessionPayload;
    const user = await prisma.profile.findUnique({
      where: { id: payload.userId },
    });
    if (!user) return null;
    return user;
  } catch {
    return null;
  }
}

