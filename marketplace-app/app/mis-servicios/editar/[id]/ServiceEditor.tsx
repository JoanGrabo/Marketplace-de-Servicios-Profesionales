"use client";

import ServiceComposer from "@/app/mis-servicios/ServiceComposer";
import PromoteServiceButton from "@/app/mis-servicios/_components/PromoteServiceButton";

type Service = {
  title: string;
  category: string | null;
  subcategory: string | null;
  shortDescription: string | null;
  description: string | null;
  includesText: string | null;
  requirementsText: string | null;
  thumbnailUrl: string | null;
  priceCents: number;
  deliveryDays: number;
  fastDeliveryEnabled: boolean;
  fastDeliveryExtraCents: number | null;
  isPromoted: boolean;
};

type Props = {
  sellerName: string;
  serviceId: string;
  promotionActive: boolean;
  promotionUntilLabel?: string | null;
  promoteOnLoad?: boolean;
  promotionOffer?: { priceCents: number; days: number };
  initial: Service;
  action: (formData: FormData) => void;
};

export default function ServiceEditor({
  sellerName,
  serviceId,
  promotionActive,
  promotionUntilLabel,
  promoteOnLoad,
  promotionOffer,
  initial,
  action,
}: Props) {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="font-semibold">Estás editando tu servicio.</p>
            <p className="mt-1 text-amber-800/90">
              Puedes actualizar campos y volver a publicar los cambios. Si quieres aparecer primero en el catálogo,
              puedes destacar el servicio mediante pago.
            </p>
            {promotionActive && promotionUntilLabel ? (
              <p className="mt-2 text-xs text-amber-800/90">
                Destacado activo hasta <span className="font-semibold">{promotionUntilLabel}</span>.
              </p>
            ) : null}
          </div>
          {!promotionActive ? (
            <PromoteServiceButton
              serviceId={serviceId}
              offer={promotionOffer}
              autoStart={Boolean(promoteOnLoad)}
            />
          ) : null}
        </div>
      </div>
      <ServiceComposer
        sellerName={sellerName}
        action={action}
        initial={{
          category: (initial.category as any) ?? "Arquitectura",
          subcategory: initial.subcategory ?? "",
          title: initial.title,
          shortDescription: initial.shortDescription ?? "",
          description: initial.description ?? "",
          includesText: initial.includesText ?? "",
          requirementsText: initial.requirementsText ?? "",
          thumbnailUrl: initial.thumbnailUrl ?? "",
          priceEuros: Math.round(initial.priceCents / 100),
          deliveryDays: initial.deliveryDays,
          fastDeliveryEnabled: initial.fastDeliveryEnabled,
          fastDeliveryExtraEuros:
            initial.fastDeliveryExtraCents == null ? null : Math.round(initial.fastDeliveryExtraCents / 100),
        }}
      />
    </div>
  );
}

