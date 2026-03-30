"use client";

import ServiceComposer from "@/app/mis-servicios/ServiceComposer";

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
  initial: Service;
  action: (formData: FormData) => void;
};

export default function ServiceEditor({ sellerName, initial, action }: Props) {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        Estás editando tu servicio. Puedes actualizar campos y volver a publicar los cambios.
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
          isPromoted: initial.isPromoted,
        }}
      />
    </div>
  );
}

