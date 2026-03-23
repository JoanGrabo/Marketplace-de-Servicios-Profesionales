import { NextResponse } from "next/server";
import { consumePasswordResetToken } from "@/lib/passwordReset";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const token = String(body.token ?? "");
    const password = String(body.password ?? "");

    if (!token) {
      return NextResponse.json(
        { ok: false, message: "Token inválido." },
        { status: 400 },
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { ok: false, message: "La contraseña debe tener al menos 6 caracteres." },
        { status: 400 },
      );
    }

    const result = await consumePasswordResetToken(token, password);
    if (!result.ok) {
      return NextResponse.json(
        { ok: false, message: result.message ?? "No se pudo restablecer la contraseña." },
        { status: 400 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("reset-password error:", e);
    return NextResponse.json(
      { ok: false, message: "No se pudo restablecer la contraseña." },
      { status: 500 },
    );
  }
}
