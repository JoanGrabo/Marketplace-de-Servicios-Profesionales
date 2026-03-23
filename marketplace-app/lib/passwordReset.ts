import crypto from "crypto";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { getAppBaseUrl, sendMail } from "@/lib/mailer";

const TOKEN_TTL_HOURS = 2;

function sha256(value: string): string {
  return crypto.createHash("sha256").update(value).digest("hex");
}

export async function createPasswordResetToken(profileId: string): Promise<string> {
  const rawToken = crypto.randomBytes(32).toString("hex");
  const tokenHash = sha256(rawToken);
  const expiresAt = new Date(Date.now() + TOKEN_TTL_HOURS * 60 * 60 * 1000);

  await prisma.passwordResetToken.create({
    data: {
      profileId,
      tokenHash,
      expiresAt,
    },
  });

  return rawToken;
}

export async function sendPasswordResetEmail(email: string, rawToken: string): Promise<void> {
  const resetUrl = `${getAppBaseUrl()}/auth/reset-password?token=${encodeURIComponent(rawToken)}`;
  await sendMail({
    to: email,
    subject: "Restablece tu contraseña en CONNECTIA",
    text: `Para restablecer tu contraseña en CONNECTIA abre este enlace: ${resetUrl}`,
    html: `
      <p>Hemos recibido una solicitud para restablecer tu contraseña en <strong>CONNECTIA</strong>.</p>
      <p>Puedes crear una nueva contraseña con este enlace:</p>
      <p><a href="${resetUrl}">Restablecer contraseña</a></p>
      <p>Este enlace caduca en ${TOKEN_TTL_HOURS} horas.</p>
    `,
  });
}

export async function consumePasswordResetToken(rawToken: string, newPassword: string): Promise<{
  ok: boolean;
  message?: string;
}> {
  const tokenHash = sha256(rawToken);
  const record = await prisma.passwordResetToken.findUnique({
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

  const passwordHash = await bcrypt.hash(newPassword, 10);
  await prisma.$transaction([
    prisma.passwordResetToken.update({
      where: { id: record.id },
      data: { consumedAt: new Date() },
    }),
    prisma.profile.update({
      where: { id: record.profileId },
      data: { passwordHash, authProvider: "credentials" },
    }),
  ]);

  return { ok: true };
}
