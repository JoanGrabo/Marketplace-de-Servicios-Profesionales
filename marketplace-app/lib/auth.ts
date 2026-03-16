import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "./db";
import type { Profile } from "@prisma/client";

export const COOKIE_NAME = "connectia_session";

function getJwtSecret(): string {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error("Falta AUTH_SECRET en variables de entorno.");
  }
  return secret;
}

export type SessionPayload = {
  userId: string;
  email: string;
  role: string;
};

export function createSessionToken(user: Profile): string {
  const payload: SessionPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  return jwt.sign(payload, getJwtSecret(), {
    expiresIn: "7d",
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

