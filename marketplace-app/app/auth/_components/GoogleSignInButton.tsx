"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
          }) => void;
          renderButton: (
            parent: HTMLElement,
            options: {
              theme?: "outline" | "filled_blue" | "filled_black";
              size?: "large" | "medium" | "small";
              text?: "signin_with" | "signup_with" | "continue_with" | "signin";
              shape?: "rectangular" | "pill" | "circle" | "square";
              width?: string | number;
            }
          ) => void;
        };
      };
    };
  }
}

type Props = {
  mode: "login" | "register";
  role?: "cliente" | "profesional";
  redirectTo?: string;
};

export default function GoogleSignInButton({ mode, role, redirectTo = "/" }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const envClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!envClientId) {
      setError("Google no está configurado todavía.");
      return;
    }
    const clientId: string = envClientId;

    const existingScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
    if (!existingScript) {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = initGoogle;
      document.head.appendChild(script);
    } else {
      initGoogle();
    }

    function initGoogle() {
      if (!window.google || !containerRef.current) return;
      containerRef.current.innerHTML = "";
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: async ({ credential }) => {
          setError(null);
          const res = await fetch("/api/auth/google", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ credential, role }),
          });
          const data = await res.json();
          if (!res.ok || !data.ok) {
            setError(data.message ?? "No se pudo iniciar sesión con Google.");
            return;
          }
          router.push(redirectTo);
          router.refresh();
        },
      });
      window.google.accounts.id.renderButton(containerRef.current, {
        theme: "outline",
        size: "large",
        text: mode === "register" ? "signup_with" : "signin_with",
        shape: "rectangular",
        width: 320,
      });
    }
  }, [mode, role, router]);

  return (
    <div className="space-y-2">
      <div ref={containerRef} />
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
