import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { COOKIE_NAME, createSessionToken } from "@/lib/auth";
import { consumeVerificationToken } from "@/lib/emailVerification";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(new URL("/auth/login?verified=missing", req.url));
  }

  const result = await consumeVerificationToken(token);
  if (!result.ok || !result.profileId) {
    const status = encodeURIComponent(result.message ?? "error");
    return NextResponse.redirect(new URL(`/auth/login?verified=${status}`, req.url));
  }

  const user = await prisma.profile.findUnique({ where: { id: result.profileId } });
  if (!user) {
    return NextResponse.redirect(new URL("/auth/login?verified=error", req.url));
  }

  const sessionToken = createSessionToken(user);
  const res = NextResponse.redirect(new URL("/?verified=ok", req.url));
  res.cookies.set(COOKIE_NAME, sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
  });
  return res;
}
