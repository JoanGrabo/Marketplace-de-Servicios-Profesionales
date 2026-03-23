import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import {
  COOKIE_NAME,
  createSessionToken,
  getSessionMaxAgeSeconds,
} from "@/lib/auth";
import { isValidEmail, normalizeEmail } from "@/lib/validation";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = normalizeEmail(body.email);
    const password = body.password as string | undefined;
    const remember = Boolean(body.remember);

    if (!email || !password || !isValidEmail(email)) {
      return NextResponse.json(
        { ok: false, message: "Email válido y contraseña son obligatorios." },
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
    if (!user.emailVerifiedAt) {
      return NextResponse.json(
        { ok: false, message: "Debes verificar tu correo antes de iniciar sesión." },
        { status: 403 },
      );
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json(
        { ok: false, message: "Credenciales incorrectas." },
        { status: 401 },
      );
    }

    const token = createSessionToken(user, { remember });
    const res = NextResponse.json({ ok: true });
    res.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
      maxAge: getSessionMaxAgeSeconds(remember),
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

