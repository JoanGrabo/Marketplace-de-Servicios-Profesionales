import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import {
  COOKIE_NAME,
  createSessionToken,
  getSessionMaxAgeSeconds,
} from "@/lib/auth";
import { consumeVerificationToken } from "@/lib/emailVerification";
import { getAppBaseUrl } from "@/lib/mailer";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");
  const appBaseUrl = (() => {
    try {
      return getAppBaseUrl();
    } catch {
      return new URL(req.url).origin;
    }
  })();

  if (!token) {
    return NextResponse.redirect(new URL("/auth/login?verified=missing", appBaseUrl));
  }

  const result = await consumeVerificationToken(token);
  if (!result.ok || !result.profileId) {
    const status = encodeURIComponent(result.message ?? "error");
    return NextResponse.redirect(new URL(`/auth/login?verified=${status}`, appBaseUrl));
  }

  const user = await prisma.profile.findUnique({ where: { id: result.profileId } });
  if (!user) {
    return NextResponse.redirect(new URL("/auth/login?verified=error", appBaseUrl));
  }

  const sessionToken = createSessionToken(user);
  const res = NextResponse.redirect(new URL("/?verified=ok", appBaseUrl));
  res.cookies.set(COOKIE_NAME, sessionToken, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    path: "/",
    maxAge: getSessionMaxAgeSeconds(false),
  });
  return res;
}
