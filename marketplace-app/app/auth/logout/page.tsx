"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    async function doLogout() {
      try {
        await fetch("/api/auth/login", { method: "DELETE" });
      } catch (e) {
        // ignore
      } finally {
        router.replace("/");
        router.refresh();
      }
    }
    void doLogout();
  }, [router]);

  return (
    <main className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-md flex-col items-center justify-center px-4 py-10 sm:px-6">
      <p className="text-sm text-gray-600">Cerrando sesión...</p>
    </main>
  );
}

