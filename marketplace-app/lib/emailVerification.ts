import crypto from "crypto";
import { prisma } from "@/lib/db";
import { getAppBaseUrl, sendMail } from "@/lib/mailer";

const TOKEN_TTL_HOURS = 24;

function sha256(value: string): string {
  return crypto.createHash("sha256").update(value).digest("hex");
}

export async function createEmailVerificationToken(profileId: string): Promise<string> {
  const rawToken = crypto.randomBytes(32).toString("hex");
  const tokenHash = sha256(rawToken);
  const expiresAt = new Date(Date.now() + TOKEN_TTL_HOURS * 60 * 60 * 1000);

  await prisma.emailVerificationToken.create({
    data: {
      profileId,
      tokenHash,
      expiresAt,
    },
  });

  return rawToken;
}

export async function sendVerificationEmail(email: string, rawToken: string): Promise<void> {
  const verifyUrl = `${getAppBaseUrl()}/api/auth/verify-email?token=${encodeURIComponent(rawToken)}`;
  await sendMail({
    to: email,
    subject: "Verifica tu correo en Expertysm",
    text: `Confirma tu cuenta en Expertysm abriendo este enlace: ${verifyUrl}`,
    html: `
      <p>Gracias por registrarte en <strong>Expertysm</strong>.</p>
      <p>Para activar tu cuenta, verifica tu correo con este enlace:</p>
      <p><a href="${verifyUrl}">Verificar mi cuenta</a></p>
      <p>Este enlace caduca en ${TOKEN_TTL_HOURS} horas.</p>
    `,
  });
}

export async function consumeVerificationToken(rawToken: string): Promise<{
  ok: boolean;
  message?: string;
  profileId?: string;
}> {
  const tokenHash = sha256(rawToken);
  const record = await prisma.emailVerificationToken.findUnique({
    where: { tokenHash },
  });

  if (!record) {
    return { ok: false, message: "Token inválido." };
  }
  if (record.consumedAt) {
    return { ok: false, message: "Este enlace ya se ha usado." };
  }
  if (record.expiresAt.getTime() < Date.now()) {
    return { ok: false, message: "Este enlace ha caducado." };
  }

  await prisma.$transaction([
    prisma.emailVerificationToken.update({
      where: { id: record.id },
      data: { consumedAt: new Date() },
    }),
    prisma.profile.update({
      where: { id: record.profileId },
      data: { emailVerifiedAt: new Date() },
    }),
  ]);

  return { ok: true, profileId: record.profileId };
}
