import Image from "next/image";

export default function HomePage() {
  return (
    <main className="flex min-h-[calc(100vh-5rem)] flex-col items-center justify-center px-6 py-12">
      <Image
        src="/connectia-logo.png"
        alt="CONNECTIA"
        width={280}
        height={140}
        className="mb-8 h-auto w-48 object-contain sm:w-64"
        priority
      />
      <h1 className="mb-2 text-center text-2xl font-bold sm:text-3xl">
        <span className="text-[var(--connectia-gray)]">CONNECT</span>
        <span className="text-[var(--connectia-gold)]">IA</span>
      </h1>
      <p className="mb-1 text-center text-sm font-medium text-gray-500 sm:text-base">
        — CONECTA • APRENDE • CRECE —
      </p>
      <p className="mt-6 max-w-md text-center text-gray-600">
        Servicios de arquitectura, renders, planos y asesoría. Próximamente servicios legales.
      </p>
    </main>
  );
}
