const SIGNALS = [
  { label: "Plataforma especializada", hint: "Enfoque en dos áreas profesionales" },
  { label: "Perfiles de profesionales", hint: "Identidad visible en cada servicio" },
  { label: "Comunicación clara", hint: "Mensajería para alinear el encargo" },
  { label: "Servicios comparables", hint: "Precio y entrega en cada ficha" },
];

export default function HomeTrust() {
  return (
    <section className="border-b border-gray-200/80 bg-white py-14 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--connectia-gold)]">
            Confianza
          </p>
          <h2 className="mt-3 text-2xl font-bold text-[var(--connectia-gray)] sm:text-3xl">
            Transparencia desde el primer vistazo
          </h2>
          <p className="mt-2 text-sm text-gray-600 sm:text-base">
            Estamos construyendo Expertysm con criterios de claridad. Más adelante podrás ver aquí métricas
            reales de uso; de momento, estos son nuestros compromisos.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SIGNALS.map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-gray-100 bg-gradient-to-b from-gray-50/80 to-white px-5 py-6 text-center shadow-sm"
            >
              <p className="text-sm font-semibold text-[var(--connectia-gray)]">{s.label}</p>
              <p className="mt-2 text-xs text-gray-500">{s.hint}</p>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-10 max-w-3xl rounded-2xl border border-dashed border-gray-200 bg-gray-50/50 px-6 py-8 text-center">
          <p className="text-xs font-medium uppercase tracking-wider text-gray-400">Reservado para métricas</p>
          <p className="mt-2 text-sm text-gray-500">
            Cuando tengamos datos públicos (por ejemplo, número de servicios activos o profesionales), los
            mostraremos aquí para reforzar la confianza con números reales.
          </p>
        </div>
      </div>
    </section>
  );
}
