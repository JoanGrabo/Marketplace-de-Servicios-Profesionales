import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { canSendMail } from "@/lib/mailer";
import { createEmailVerificationToken, sendVerificationEmail } from "@/lib/emailVerification";
import { isValidEmail, normalizeEmail, parseRole } from "@/lib/validation";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = normalizeEmail(body.email);
    const password = body.password as string | undefined;
    const role = parseRole(body.role ?? "cliente");

    if (!email || !isValidEmail(email) || !password || password.length < 6) {
      return NextResponse.json(
        {
          ok: false,
          message: "Email válido y contraseña (mín. 6 caracteres) son obligatorios.",
        },
        { status: 400 },
      );
    }
    if (!role) {
      return NextResponse.json(
        { ok: false, message: "Rol no válido." },
        { status: 400 },
      );
    }

    const existing = await prisma.profile.findUnique({ where: { email } });
    if (existing) {
      if (existing.emailVerifiedAt) {
        return NextResponse.json(
          { ok: false, message: "Ya existe un usuario con ese email." },
          { status: 409 },
        );
      }

      if (!canSendMail()) {
        return NextResponse.json(
          { ok: false, message: "No se puede reenviar la verificación. Contacta con soporte." },
          { status: 500 },
        );
      }
      const updatedPasswordHash = await bcrypt.hash(password, 10);
      await prisma.profile.update({
        where: { id: existing.id },
        data: {
          passwordHash: updatedPasswordHash,
          role,
          authProvider: "credentials",
        },
      });
      const rawToken = await createEmailVerificationToken(existing.id);
      await sendVerificationEmail(existing.email, rawToken);
      return NextResponse.json(
        { ok: true, message: "Te hemos reenviado el enlace de verificación." },
      );
    }

    if (!canSendMail()) {
      return NextResponse.json(
        {
          ok: false,
          message: "Registro temporalmente no disponible: falta configurar el envío de correos.",
        },
        { status: 500 },
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.profile.create({
      data: {
        email,
        role,
        passwordHash,
        authProvider: "credentials",
      },
    });

    const rawToken = await createEmailVerificationToken(user.id);
    await sendVerificationEmail(user.email, rawToken);

    return NextResponse.json({
      ok: true,
      message: "Te hemos enviado un email para verificar tu cuenta antes de entrar.",
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    return NextResponse.json(
      { ok: false, message: "Error al registrar usuario." },
      { status: 500 },
    );
  }
}

