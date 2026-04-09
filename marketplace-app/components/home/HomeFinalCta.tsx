import Link from "next/link";

type Props = {
  publishHref: string;
};

export default function HomeFinalCta({ publishHref }: Props) {
  return (
    <section className="bg-gradient-to-b from-white to-[#f3f1ed] py-16 sm:py-20">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
        <h2 className="text-3xl font-bold tracking-tight text-[var(--connectia-gray)] sm:text-4xl">
          Tu proyecto merece el profesional adecuado
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-base text-gray-600 sm:text-lg">
          Explora servicios de arquitectura y legal, compara con claridad y habla directamente con quien puede
          ayudarte. Si ofreces esos servicios, publica y deja que te encuentren.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <Link
            href="/servicios"
            className="inline-flex h-12 w-full max-w-xs items-center justify-center rounded-xl bg-[var(--connectia-gold)] px-8 text-sm font-semibold text-white shadow-lg shadow-[var(--connectia-gold)]/20 transition hover:brightness-105 sm:w-auto"
          >
            Encontrar profesional
          </Link>
          <Link
            href={publishHref}
            className="inline-flex h-12 w-full max-w-xs items-center justify-center rounded-xl border-2 border-[var(--connectia-gray)]/15 bg-white px-8 text-sm font-semibold text-[var(--connectia-gray)] shadow-sm transition hover:border-[var(--connectia-gold)]/35 sm:w-auto"
          >
            Publica tu servicio gratis
          </Link>
        </div>
      </div>
    </section>
  );
}
