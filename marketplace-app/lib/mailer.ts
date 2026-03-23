import nodemailer from "nodemailer";

function getMailerEnv() {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  const from = process.env.MAIL_FROM || user;
  const appBaseUrl = process.env.APP_BASE_URL;

  return { user, pass, from, appBaseUrl };
}

export function canSendMail(): boolean {
  const { user, pass, from, appBaseUrl } = getMailerEnv();
  return !!(user && pass && from && appBaseUrl);
}

export async function sendMail(params: {
  to: string;
  subject: string;
  html: string;
  text: string;
}) {
  const { user, pass, from } = getMailerEnv();
  if (!user || !pass || !from) {
    throw new Error("Falta configurar GMAIL_USER, GMAIL_APP_PASSWORD o MAIL_FROM.");
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });

  await transporter.sendMail({
    from,
    to: params.to,
    subject: params.subject,
    html: params.html,
    text: params.text,
  });
}

export function getAppBaseUrl(): string {
  const { appBaseUrl } = getMailerEnv();
  if (!appBaseUrl) {
    throw new Error("Falta APP_BASE_URL para construir enlaces de verificación.");
  }
  return appBaseUrl.replace(/\/$/, "");
}
