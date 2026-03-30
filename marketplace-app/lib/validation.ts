export const ALLOWED_ROLES = new Set(["cliente", "profesional"] as const);

export const SERVICE_LIMITS = {
  titleMin: 5,
  titleMax: 80,
  shortDescriptionMax: 120,
  descriptionMax: 1200,
  minPriceEuros: 1,
  maxPriceEuros: 200000,
  minDeliveryDays: 1,
  maxDeliveryDays: 365,
};

export const SERVICE_CATEGORIES = ["Arquitectura", "Legal"] as const;

export const SERVICE_SUBCATEGORIES: Record<(typeof SERVICE_CATEGORIES)[number], string[]> = {
  Arquitectura: [
    "Renderizado",
    "Planos",
    "Modelado 3D",
    "Asesoría de diseño",
    "Proyecto básico",
    "Reforma",
  ],
  Legal: [
    "Contratos",
    "Reclamaciones",
    "Asesoría jurídica",
    "Protección de datos",
    "Laboral",
    "Civil",
  ],
};

export const MESSAGE_LIMITS = {
  min: 10,
  max: 2000,
};

export function getMessageCooldownSeconds(): number {
  const parsed = Number(process.env.MESSAGE_COOLDOWN_SECONDS ?? "");
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return 20;
  }
  return Math.floor(parsed);
}

type ServiceInput = {
  title: string;
  category?: string;
  subcategory?: string;
  shortDescription?: string;
  description?: string;
  includesText?: string;
  requirementsText?: string;
  thumbnailUrl?: string;
  priceEuros: number;
  deliveryDays: number;
  fastDeliveryEnabled?: boolean;
  fastDeliveryExtraEuros?: number;
  isPromoted?: boolean;
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
    category: (typeof SERVICE_CATEGORIES)[number];
    subcategory: string | null;
    shortDescription: string | null;
    description: string | null;
    includesText: string | null;
    requirementsText: string | null;
    thumbnailUrl: string;
    priceCents: number;
    deliveryDays: number;
    fastDeliveryEnabled: boolean;
    fastDeliveryExtraCents: number | null;
    isPromoted: boolean;
  };
} {
  const title = input.title.trim();
  const description = (input.description ?? "").trim();
  const shortDescription = (input.shortDescription ?? "").trim();
  const categoryRaw = String(input.category ?? "").trim();
  const subcategoryRaw = String(input.subcategory ?? "").trim();
  const includesText = String(input.includesText ?? "").trim();
  const requirementsText = String(input.requirementsText ?? "").trim();
  const thumbnailUrl = String(input.thumbnailUrl ?? "").trim();
  const priceEuros = Number(input.priceEuros);
  const deliveryDays = Number(input.deliveryDays);
  const fastDeliveryEnabled = Boolean(input.fastDeliveryEnabled);
  const fastDeliveryExtraEuros = input.fastDeliveryExtraEuros == null ? null : Number(input.fastDeliveryExtraEuros);
  const isPromoted = Boolean(input.isPromoted);

  const category = (SERVICE_CATEGORIES as readonly string[]).includes(categoryRaw)
    ? (categoryRaw as (typeof SERVICE_CATEGORIES)[number])
    : null;

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

  if (!category) {
    return { ok: false, message: "Debes seleccionar una categoría." };
  }

  if (subcategoryRaw) {
    const allowed = SERVICE_SUBCATEGORIES[category] ?? [];
    if (!allowed.includes(subcategoryRaw)) {
      return { ok: false, message: "Subcategoría no válida para la categoría seleccionada." };
    }
  }

  if (shortDescription.length > SERVICE_LIMITS.shortDescriptionMax) {
    return {
      ok: false,
      message: `La descripción corta no puede superar ${SERVICE_LIMITS.shortDescriptionMax} caracteres.`,
    };
  }

  if (!thumbnailUrl) {
    return { ok: false, message: "Debes añadir una imagen principal (URL) para la portada del servicio." };
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

  if (fastDeliveryEnabled) {
    if (fastDeliveryExtraEuros == null || Number.isNaN(fastDeliveryExtraEuros) || fastDeliveryExtraEuros <= 0) {
      return { ok: false, message: "Si activas entrega rápida, añade un precio extra válido." };
    }
  }

  return {
    ok: true,
    data: {
      title,
      category,
      subcategory: subcategoryRaw || null,
      shortDescription: shortDescription || null,
      description: description || null,
      includesText: includesText || null,
      requirementsText: requirementsText || null,
      thumbnailUrl,
      priceCents: Math.round(priceEuros * 100),
      deliveryDays,
      fastDeliveryEnabled,
      fastDeliveryExtraCents: fastDeliveryEnabled ? Math.round((fastDeliveryExtraEuros as number) * 100) : null,
      isPromoted,
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
