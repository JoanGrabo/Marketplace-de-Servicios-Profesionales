"use client";

import { useEffect, useMemo, useState } from "react";
import { SERVICE_CATEGORIES, SERVICE_SUBCATEGORIES, SERVICE_LIMITS } from "@/lib/validation";
import { resolveServiceThumbnailSrc } from "@/lib/serviceMedia";

type Category = (typeof SERVICE_CATEGORIES)[number];

type Props = {
  sellerName: string;
  action: (formData: FormData) => void;
  defaultCategory?: Category;
  promotionOffer?: { priceCents: number; days: number };
  initial?: {
    category?: Category | null;
    subcategory?: string | null;
    title?: string | null;
    shortDescription?: string | null;
    description?: string | null;
    includesText?: string | null;
    requirementsText?: string | null;
    thumbnailUrl?: string | null;
    priceEuros?: number | null;
    deliveryDays?: number | null;
    fastDeliveryEnabled?: boolean | null;
    fastDeliveryExtraEuros?: number | null;
    isPromoted?: boolean | null;
  };
};

function clampText(text: string, max: number) {
  return text.length > max ? text.slice(0, max) : text;
}

export default function ServiceComposer({ sellerName, action, defaultCategory, initial }: Props) {
  const [category, setCategory] = useState<Category>(
    initial?.category ?? defaultCategory ?? "Arquitectura",
  );
  const [subcategory, setSubcategory] = useState<string>(initial?.subcategory ?? "");
  const [title, setTitle] = useState(initial?.title ?? "");
  const [shortDescription, setShortDescription] = useState(initial?.shortDescription ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [includesText, setIncludesText] = useState(initial?.includesText ?? "");
  const [requirementsText, setRequirementsText] = useState(initial?.requirementsText ?? "");
  const [thumbnailUrl, setThumbnailUrl] = useState(initial?.thumbnailUrl ?? "");
  const initialServeUrl = resolveServiceThumbnailSrc(initial?.thumbnailUrl) ?? "";
  const [thumbnailPreviewUrl, setThumbnailPreviewUrl] = useState(
    initialServeUrl ? `${initialServeUrl}?v=${Date.now()}` : "",
  );
  const [thumbnailUploading, setThumbnailUploading] = useState(false);
  const [thumbnailError, setThumbnailError] = useState<string | null>(null);
  const [priceEuros, setPriceEuros] = useState<number | "">(initial?.priceEuros ?? "");
  const [deliveryDays, setDeliveryDays] = useState<number | "">(initial?.deliveryDays ?? 7);
  const [fastDeliveryEnabled, setFastDeliveryEnabled] = useState(Boolean(initial?.fastDeliveryEnabled));
  const [fastDeliveryExtraEuros, setFastDeliveryExtraEuros] = useState<number | "">(initial?.fastDeliveryExtraEuros ?? "");
  const [promoteAfterPublish, setPromoteAfterPublish] = useState(false);

  const subcategories = SERVICE_SUBCATEGORIES[category] ?? [];

  useEffect(() => {
    // reset subcategory if not valid for selected category
    if (subcategory && !subcategories.includes(subcategory)) {
      setSubcategory("");
    }
  }, [category, subcategories, subcategory]);

  const titleHelper = useMemo(() => {
    if (category === "Arquitectura") return 'Ej: "Te hago un render realista de tu vivienda"';
    return 'Ej: "Te redacto un contrato de alquiler claro y profesional"';
  }, [category]);

  const canPublish = useMemo(() => {
    const priceOk = typeof priceEuros === "number" && Number.isFinite(priceEuros) && priceEuros >= 1;
    const deliveryOk = typeof deliveryDays === "number" && Number.isFinite(deliveryDays) && deliveryDays >= 1;
    const fastOk = !fastDeliveryEnabled || (typeof fastDeliveryExtraEuros === "number" && fastDeliveryExtraEuros > 0);
    return (
      title.trim().length >= SERVICE_LIMITS.titleMin &&
      title.trim().length <= SERVICE_LIMITS.titleMax &&
      Boolean(category) &&
      priceOk &&
      deliveryOk &&
      fastOk
    );
  }, [category, deliveryDays, fastDeliveryEnabled, fastDeliveryExtraEuros, priceEuros, title]);

  async function onChangeThumbnail(file: File | null) {
    if (!file) return;
    setThumbnailError(null);
    setThumbnailUploading(true);
    try {
      const formData = new FormData();
      formData.append("thumbnail", file);
      const res = await fetch("/api/mis-servicios/thumbnail", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setThumbnailError(data.message ?? "No se pudo subir la imagen.");
        setThumbnailUploading(false);
        return;
      }
      const nextUrl = String(data.url ?? "");
      const serveUrl = String(data.serveUrl ?? "");
      setThumbnailUrl(nextUrl);
      // Para preview usamos el endpoint /api (sin cache) y así se ve al instante.
      setThumbnailPreviewUrl(serveUrl ? `${serveUrl}?v=${Date.now()}` : nextUrl ? `${nextUrl}?v=${Date.now()}` : "");
      setThumbnailUploading(false);
    } catch {
      setThumbnailError("Error inesperado al subir la imagen.");
      setThumbnailUploading(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <form action={action} className="space-y-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-[var(--connectia-gray)]">Publicar servicio</h2>
            <p className="mt-1 text-sm text-gray-600">
              Crea una ficha clara y visual. Esto es lo que verán tus clientes en el catálogo.
            </p>
          </div>
          <div className="hidden rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800 lg:block">
            Arquitectura y Legal
          </div>
        </div>

        {/* Bloque: Información básica */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-gray-700">Información básica</h3>
            <span className="text-xs text-gray-500">Campos obligatorios marcados *</span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Categoría *</label>
              <select
                name="category"
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-[var(--connectia-gold)] focus:outline-none focus:ring-1 focus:ring-[var(--connectia-gold)]"
              >
                {SERVICE_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Subcategoría <span className="text-gray-400">(recomendada)</span>
              </label>
              <select
                name="subcategory"
                value={subcategory}
                onChange={(e) => setSubcategory(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-[var(--connectia-gold)] focus:outline-none focus:ring-1 focus:ring-[var(--connectia-gold)]"
              >
                <option value="">Selecciona una subcategoría</option>
                {subcategories.map((sc) => (
                  <option key={sc} value={sc}>
                    {sc}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <div className="flex items-end justify-between gap-3">
              <label className="mb-1 block text-sm font-medium text-gray-700">Título del servicio *</label>
              <span className="text-xs text-gray-500">
                {clampText(title.trim(), SERVICE_LIMITS.titleMax).length}/{SERVICE_LIMITS.titleMax}
              </span>
            </div>
            <input
              name="title"
              value={title}
              onChange={(e) => setTitle(clampText(e.target.value, SERVICE_LIMITS.titleMax))}
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-[var(--connectia-gold)] focus:outline-none focus:ring-1 focus:ring-[var(--connectia-gold)]"
              placeholder={category === "Arquitectura" ? "Te hago un render realista de tu vivienda" : "Te redacto un contrato de alquiler claro y profesional"}
            />
            <p className="mt-1 text-xs text-gray-500">{titleHelper}</p>
          </div>

          <div>
            <div className="flex items-end justify-between gap-3">
              <label className="mb-1 block text-sm font-medium text-gray-700">Descripción corta</label>
              <span className="text-xs text-gray-500">
                {clampText(shortDescription.trim(), SERVICE_LIMITS.shortDescriptionMax).length}/{SERVICE_LIMITS.shortDescriptionMax}
              </span>
            </div>
            <input
              name="shortDescription"
              value={shortDescription}
              onChange={(e) => setShortDescription(clampText(e.target.value, SERVICE_LIMITS.shortDescriptionMax))}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-[var(--connectia-gold)] focus:outline-none focus:ring-1 focus:ring-[var(--connectia-gold)]"
              placeholder="Resumen para el catálogo (máx. 120 caracteres)"
            />
            <p className="mt-1 text-xs text-gray-500">Se mostrará en la card del catálogo.</p>
          </div>
        </section>

        {/* Bloque: Contenido */}
        <section className="space-y-4 border-t border-gray-100 pt-6">
          <h3 className="text-sm font-semibold uppercase tracking-widest text-gray-700">Contenido</h3>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Descripción completa</label>
            <textarea
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={7}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-[var(--connectia-gold)] focus:outline-none focus:ring-1 focus:ring-[var(--connectia-gold)]"
              placeholder="Explica qué incluye, qué entregas y cómo trabajas. Sé concreto y profesional."
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Qué incluye</label>
              <textarea
                name="includesText"
                value={includesText}
                onChange={(e) => setIncludesText(e.target.value)}
                rows={6}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-[var(--connectia-gold)] focus:outline-none focus:ring-1 focus:ring-[var(--connectia-gold)]"
                placeholder={
                  category === "Arquitectura"
                    ? "2 propuestas iniciales\n1 render en alta calidad\n2 revisiones"
                    : "Revisión del documento\nRedacción personalizada\nUna ronda de cambios"
                }
              />
              <p className="mt-1 text-xs text-gray-500">Una línea = un punto en la lista.</p>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Requisitos para empezar</label>
              <textarea
                name="requirementsText"
                value={requirementsText}
                onChange={(e) => setRequirementsText(e.target.value)}
                rows={6}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-[var(--connectia-gold)] focus:outline-none focus:ring-1 focus:ring-[var(--connectia-gold)]"
                placeholder={
                  category === "Arquitectura"
                    ? "Necesito planos, medidas o referencias\nFotos del espacio (si aplica)"
                    : "Documentación del caso\nContrato actual (si existe)\nDatos de las partes"
                }
              />
              <p className="mt-1 text-xs text-gray-500">Ayuda a reducir idas y vueltas.</p>
            </div>
          </div>
        </section>

        {/* Bloque: Precio y entrega */}
        <section className="space-y-4 border-t border-gray-100 pt-6">
          <h3 className="text-sm font-semibold uppercase tracking-widest text-gray-700">Precio y entrega</h3>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Precio desde (EUR) *</label>
              <input
                name="priceEuros"
                type="number"
                min={1}
                step={1}
                value={priceEuros}
                onChange={(e) => setPriceEuros(e.target.value === "" ? "" : Number(e.target.value))}
                required
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-[var(--connectia-gold)] focus:outline-none focus:ring-1 focus:ring-[var(--connectia-gold)]"
                placeholder="120"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Días de entrega *</label>
              <input
                name="deliveryDays"
                type="number"
                min={1}
                step={1}
                value={deliveryDays}
                onChange={(e) => setDeliveryDays(e.target.value === "" ? "" : Number(e.target.value))}
                required
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-[var(--connectia-gold)] focus:outline-none focus:ring-1 focus:ring-[var(--connectia-gold)]"
              />
            </div>
          </div>

          {promotionOffer ? (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  name="promoteAfterPublish"
                  checked={promoteAfterPublish}
                  onChange={(e) => setPromoteAfterPublish(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-amber-300 text-[var(--connectia-gold)] focus:ring-[var(--connectia-gold)]"
                />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-amber-900">
                    Destacar al publicar{" "}
                    <span className="font-semibold text-amber-900/80">
                      ({Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(promotionOffer.priceCents / 100)} ·{" "}
                      {promotionOffer.days} {promotionOffer.days === 1 ? "día" : "días"})
                    </span>
                  </p>
                  <p className="mt-0.5 text-xs text-amber-800/90">
                    Si lo marcas, al publicar te llevaremos a Stripe para pagar el destacado. Si no lo marcas, publicarás sin coste extra.
                  </p>
                </div>
              </label>
            </div>
          ) : null}

          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                name="fastDeliveryEnabled"
                checked={fastDeliveryEnabled}
                onChange={(e) => setFastDeliveryEnabled(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-gray-300 text-[var(--connectia-gold)] focus:ring-[var(--connectia-gold)]"
              />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-800">Entrega rápida</p>
                <p className="text-xs text-gray-600">Actívala para ofrecer urgencia con un precio extra.</p>
              </div>
            </label>
            {fastDeliveryEnabled && (
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Precio extra (EUR)</label>
                  <input
                    name="fastDeliveryExtraEuros"
                    type="number"
                    min={1}
                    step={1}
                    value={fastDeliveryExtraEuros}
                    onChange={(e) => setFastDeliveryExtraEuros(e.target.value === "" ? "" : Number(e.target.value))}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-[var(--connectia-gold)] focus:outline-none focus:ring-1 focus:ring-[var(--connectia-gold)]"
                    placeholder="50"
                  />
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Bloque: Imagen */}
        <section className="space-y-4 border-t border-gray-100 pt-6">
          <h3 className="text-sm font-semibold uppercase tracking-widest text-gray-700">Imágenes</h3>
          <div className="space-y-2">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Imagen principal <span className="text-gray-400">(opcional)</span>
            </label>
            <div className="flex flex-wrap items-center gap-3">
              <label className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50">
                {thumbnailUploading ? "Subiendo..." : "Adjuntar imagen"}
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  disabled={thumbnailUploading}
                  onChange={(e) => void onChangeThumbnail(e.target.files?.[0] ?? null)}
                />
              </label>
              {thumbnailUrl ? (
                <span className="text-xs font-medium text-emerald-700">Imagen cargada correctamente</span>
              ) : (
                <span className="text-xs text-gray-500">Formatos: JPG/PNG/WEBP. Máx. 4MB.</span>
              )}
            </div>
            {thumbnailError && <p className="text-xs text-red-600">{thumbnailError}</p>}
            <input type="hidden" name="thumbnailUrl" value={thumbnailUrl} />
            {thumbnailUrl ? (
              <p className="break-all text-[11px] text-gray-500">
                URL guardada:{" "}
                <a href={thumbnailUrl} target="_blank" rel="noreferrer" className="font-medium text-[var(--connectia-gold)] hover:underline">
                  {thumbnailUrl}
                </a>
              </p>
            ) : null}
          </div>
        </section>

        <button
          type="submit"
          disabled={!canPublish}
          className="w-full rounded-lg bg-[var(--connectia-gold)] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Publicar servicio
        </button>
      </form>

      {/* Preview */}
      <aside className="space-y-4">
        <div className="sticky top-24 space-y-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">Vista previa</p>
            <div className="mt-3 overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
              <div className="relative aspect-[16/10] w-full">
                {thumbnailPreviewUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={thumbnailPreviewUrl}
                    alt="Portada del servicio"
                    className="absolute inset-0 h-full w-full object-cover"
                    loading="lazy"
                    onError={() => setThumbnailError("La imagen no se puede cargar. Revisa que el servidor sirva la URL de /uploads/services/.")}
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-sm text-gray-500">
                    Añade una imagen para ver la portada
                  </div>
                )}
                <div className="absolute left-3 top-3 flex gap-2">
                  <span className="rounded-full border border-gray-200 bg-white/80 px-2.5 py-1 text-[11px] font-semibold text-gray-800 backdrop-blur">
                    {category}
                  </span>
                </div>
              </div>
              <div className="space-y-3 p-4">
                <h3 className="text-base font-semibold text-[var(--connectia-gray)]">
                  {title.trim() ? title.trim() : "Tu título aparecerá aquí"}
                </h3>
                <p className="text-sm text-gray-600">
                  {shortDescription.trim()
                    ? shortDescription.trim()
                    : "Añade una descripción corta para mejorar la conversión en el catálogo."}
                </p>
                <div className="flex items-end justify-between gap-3">
                  <div className="text-xs text-gray-600">
                    <p className="font-semibold text-gray-800">{sellerName}</p>
                    <p>Entrega en {typeof deliveryDays === "number" ? deliveryDays : 7} días</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Desde</p>
                    <p className="text-lg font-bold text-[var(--connectia-gold)]">
                      {typeof priceEuros === "number" ? `${priceEuros} €` : "—"}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 pt-1">
                  <div className="flex-1 rounded-lg bg-[var(--connectia-gold)] px-4 py-2 text-center text-sm font-semibold text-white opacity-80">
                    Ver servicio
                  </div>
                  <div className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 opacity-80">
                    Mensaje
                  </div>
                </div>
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-500">
            Consejo: una imagen clara + descripción corta concreta suele aumentar los clics.
          </p>
        </div>
      </aside>
    </div>
  );
}

