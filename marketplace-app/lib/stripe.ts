import Stripe from "stripe";

function getStripeSecretKey(): string {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY no está configurada.");
  }
  if (!key.startsWith("sk_")) {
    throw new Error('STRIPE_SECRET_KEY no parece válida (debe empezar por "sk_").');
  }
  return key;
}

export function getStripeClient(): Stripe {
  return new Stripe(getStripeSecretKey(), {
    apiVersion: "2025-02-24.acacia",
    typescript: true,
  });
}

export function getAppBaseUrl(): string {
  const raw = process.env.APP_BASE_URL ?? "";
  // Soporta el caso típico de `.env` con comentario al final: APP_BASE_URL="https://..." # comentario
  const withoutInlineComment = raw.split(/\s+#/)[0]?.trim() ?? "";
  const baseUrl = withoutInlineComment.replace(/\/$/, "");
  if (!baseUrl) {
    if (process.env.NODE_ENV !== "production") return "http://localhost:3000";
    throw new Error("APP_BASE_URL no está configurada.");
  }
  if (!/^https?:\/\//i.test(baseUrl)) {
    throw new Error('APP_BASE_URL debe empezar por "http://" o "https://".');
  }
  return baseUrl;
}

