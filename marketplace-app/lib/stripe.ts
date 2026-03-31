import Stripe from "stripe";

function getStripeSecretKey(): string {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY no está configurada.");
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
  const baseUrl = process.env.APP_BASE_URL?.replace(/\/$/, "");
  if (!baseUrl) {
    if (process.env.NODE_ENV !== "production") return "http://localhost:3000";
    throw new Error("APP_BASE_URL no está configurada.");
  }
  return baseUrl;
}

