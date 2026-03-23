export const ALLOWED_ROLES = new Set(["cliente", "profesional"] as const);

export const SERVICE_LIMITS = {
  titleMin: 5,
  titleMax: 90,
  descriptionMax: 1200,
  minPriceEuros: 1,
  maxPriceEuros: 200000,
  minDeliveryDays: 1,
  maxDeliveryDays: 365,
};

export const MESSAGE_LIMITS = {
  min: 10,
  max: 2000,
};

type ServiceInput = {
  title: string;
  description?: string;
  priceEuros: number;
  deliveryDays: number;
};

export function normalizeEmail(raw: unknown): string {
  return String(raw ?? "").toLowerCase().trim();
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function parseRole(raw: unknown): "cliente" | "profesional" | null {
  const role = String(raw ?? "");
  if (ALLOWED_ROLES.has(role as "cliente" | "profesional")) {
    return role as "cliente" | "profesional";
  }
  return null;
}

export function validateServiceInput(input: ServiceInput): {
  ok: boolean;
  message?: string;
  data?: {
    title: string;
    description: string | null;
    priceCents: number;
    deliveryDays: number;
  };
} {
  const title = input.title.trim();
  const description = (input.description ?? "").trim();
  const priceEuros = Number(input.priceEuros);
  const deliveryDays = Number(input.deliveryDays);

  if (
    title.length < SERVICE_LIMITS.titleMin ||
    title.length > SERVICE_LIMITS.titleMax
  ) {
    return {
      ok: false,
      message: `El título debe tener entre ${SERVICE_LIMITS.titleMin} y ${SERVICE_LIMITS.titleMax} caracteres.`,
    };
  }

  if (description.length > SERVICE_LIMITS.descriptionMax) {
    return {
      ok: false,
      message: `La descripción no puede superar ${SERVICE_LIMITS.descriptionMax} caracteres.`,
    };
  }

  if (
    Number.isNaN(priceEuros) ||
    priceEuros < SERVICE_LIMITS.minPriceEuros ||
    priceEuros > SERVICE_LIMITS.maxPriceEuros
  ) {
    return {
      ok: false,
      message: `El precio debe estar entre ${SERVICE_LIMITS.minPriceEuros} y ${SERVICE_LIMITS.maxPriceEuros} EUR.`,
    };
  }

  if (
    Number.isNaN(deliveryDays) ||
    !Number.isInteger(deliveryDays) ||
    deliveryDays < SERVICE_LIMITS.minDeliveryDays ||
    deliveryDays > SERVICE_LIMITS.maxDeliveryDays
  ) {
    return {
      ok: false,
      message: `Los días de entrega deben estar entre ${SERVICE_LIMITS.minDeliveryDays} y ${SERVICE_LIMITS.maxDeliveryDays}.`,
    };
  }

  return {
    ok: true,
    data: {
      title,
      description: description || null,
      priceCents: Math.round(priceEuros * 100),
      deliveryDays,
    },
  };
}

export function validateMessageBody(raw: unknown): {
  ok: boolean;
  message?: string;
  body?: string;
} {
  const body = String(raw ?? "").trim();
  if (body.length < MESSAGE_LIMITS.min || body.length > MESSAGE_LIMITS.max) {
    return {
      ok: false,
      message: `El mensaje debe tener entre ${MESSAGE_LIMITS.min} y ${MESSAGE_LIMITS.max} caracteres.`,
    };
  }
  return { ok: true, body };
}
