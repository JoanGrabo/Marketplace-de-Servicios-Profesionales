import { NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";
import { prisma } from "@/lib/db";
import { COOKIE_NAME, createSessionToken, getSessionMaxAgeSeconds } from "@/lib/auth";
import { parseRole } from "@/lib/validation";

type GooglePayload = {
  credential?: string;
  role?: string;
  remember?: boolean;
};

function getGoogleClientId(): string {
  const clientId = process.env.GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  if (!clientId) {
    throw new Error("Falta configurar GOOGLE_CLIENT_ID.");
  }
  return clientId;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as GooglePayload;
    const credential = body.credential;
    if (!credential) {
      return NextResponse.json({ ok: false, message: "Credential de Google obligatoria." }, { status: 400 });
    }

    const clientId = getGoogleClientId();
    const client = new OAuth2Client(clientId);
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: clientId,
    });
    const payload = ticket.getPayload();

    if (!payload?.email || !payload.email_verified) {
      return NextResponse.json(
        { ok: false, message: "No se pudo verificar el email con Google." },
        { status: 401 },
      );
    }

    const role = parseRole(body.role ?? "cliente") ?? "cliente";
    const remember = Boolean(body.remember);

    const user = await prisma.profile.upsert({
      where: { email: payload.email.toLowerCase() },
      create: {
        email: payload.email.toLowerCase(),
        name: payload.name ?? null,
        avatarUrl: payload.picture ?? null,
        role,
        authProvider: "google",
        emailVerifiedAt: new Date(),
      },
      update: {
        name: payload.name ?? undefined,
        avatarUrl: payload.picture ?? undefined,
        emailVerifiedAt: new Date(),
      },
    });

    const token = createSessionToken(user, { remember });
    const res = NextResponse.json({ ok: true });
    res.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: getSessionMaxAgeSeconds(remember),
    });
    return res;
  } catch (e) {
    console.error("Google auth error:", e);
    return NextResponse.json(
      { ok: false, message: "No se pudo iniciar sesión con Google." },
      { status: 500 },
    );
  }
}
