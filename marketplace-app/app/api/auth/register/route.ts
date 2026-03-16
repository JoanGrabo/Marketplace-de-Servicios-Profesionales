import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createSession } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = (body.email as string | undefined)?.toLowerCase().trim();
    const password = body.password as string | undefined;
    const role = (body.role as string | undefined) ?? "cliente";

    if (!email || !password || password.length < 6) {
      return NextResponse.json(
        { ok: false, message: "Email y contraseña (mín. 6 caracteres) son obligatorios." },
        { status: 400 },
      );
    }

    const existing = await prisma.profile.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { ok: false, message: "Ya existe un usuario con ese email." },
        { status: 409 },
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.profile.create({
      data: {
        email,
        role,
        passwordHash,
      },
    });

    await createSession(user);

    return NextResponse.json({ ok: true });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    return NextResponse.json(
      { ok: false, message: "Error al registrar usuario." },
      { status: 500 },
    );
  }
}

