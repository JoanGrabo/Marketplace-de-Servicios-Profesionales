import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { canSendMail } from "@/lib/mailer";
import { createPasswordResetToken, sendPasswordResetEmail } from "@/lib/passwordReset";
import { isValidEmail, normalizeEmail } from "@/lib/validation";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = normalizeEmail(body.email);

    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { ok: false, message: "Introduce un email válido." },
        { status: 400 },
      );
    }

    if (!canSendMail()) {
      return NextResponse.json(
        { ok: false, message: "El recuperador de contraseña no está configurado todavía." },
        { status: 503 },
      );
    }

    const user = await prisma.profile.findUnique({
      where: { email },
      select: { id: true, email: true },
    });

    // Respuesta neutra para no revelar si el email existe o no.
    if (!user) {
      return NextResponse.json({
        ok: true,
        message: "Si el email existe, te hemos enviado un enlace para restablecer la contraseña.",
      });
    }

    const rawToken = await createPasswordResetToken(user.id);
    await sendPasswordResetEmail(user.email, rawToken);

    return NextResponse.json({
      ok: true,
      message: "Si el email existe, te hemos enviado un enlace para restablecer la contraseña.",
    });
  } catch (e) {
    console.error("forgot-password error:", e);
    return NextResponse.json(
      { ok: false, message: "No se pudo procesar la solicitud." },
      { status: 500 },
    );
  }
}
