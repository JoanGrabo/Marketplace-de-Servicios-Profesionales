import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { COOKIE_NAME, createSessionToken } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = (body.email as string | undefined)?.toLowerCase().trim();
    const password = body.password as string | undefined;

    if (!email || !password) {
      return NextResponse.json(
        { ok: false, message: "Email y contraseña son obligatorios." },
        { status: 400 },
      );
    }

    const user = await prisma.profile.findUnique({ where: { email } });
    if (!user || !user.passwordHash) {
      return NextResponse.json(
        { ok: false, message: "Credenciales incorrectas." },
        { status: 401 },
      );
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json(
        { ok: false, message: "Credenciales incorrectas." },
        { status: 401 },
      );
    }

    const token = createSessionToken(user);
    const res = NextResponse.json({ ok: true });
    res.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });
    return res;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    return NextResponse.json(
      { ok: false, message: "Error al iniciar sesión." },
      { status: 500 },
    );
  }
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(COOKIE_NAME);
  return res;
}

