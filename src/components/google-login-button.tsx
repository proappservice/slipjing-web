"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { api, session } from "@/lib/api";

const GIS_SRC = "https://accounts.google.com/gsi/client";
const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

interface GoogleCredentialResponse {
  credential: string;
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: object) => void;
          renderButton: (el: HTMLElement, options: object) => void;
        };
      };
    };
  }
}

/**
 * ปุ่ม Google Sign-In (Google Identity Services) — ได้ id_token แล้วยิง
 * POST /auth/social ของ backend เพื่อแลกเป็น JWT ของเรา (CLAUDE.md §5)
 */
export function GoogleLoginButton({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const slot = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!CLIENT_ID) return;

    const init = () => {
      if (!window.google || !slot.current) return;
      window.google.accounts.id.initialize({
        client_id: CLIENT_ID,
        callback: async (resp: GoogleCredentialResponse) => {
          try {
            const result = await api<{ token: string; is_new_user: boolean }>("/auth/social", {
              method: "POST",
              body: { provider: "google", credential: resp.credential },
            });
            session.save(result.token);
            router.push("/dashboard");
          } catch (err) {
            setError(err instanceof Error ? err.message : "เข้าสู่ระบบไม่สำเร็จ กรุณาลองใหม่");
          }
        },
      });
      window.google.accounts.id.renderButton(slot.current, {
        theme: "outline",
        size: "large",
        width: 336,
        locale: "th",
        text: mode === "login" ? "signin_with" : "signup_with",
      });
    };

    if (window.google) {
      init();
      return;
    }
    const script = document.createElement("script");
    script.src = GIS_SRC;
    script.async = true;
    script.onload = init;
    document.head.appendChild(script);
  }, [mode, router]);

  if (!CLIENT_ID) {
    return (
      <div className="rounded-lg border border-dashed border-line px-4 py-2.5 text-center text-xs text-muted">
        ⚙️ ยังไม่ได้ตั้งค่า NEXT_PUBLIC_GOOGLE_CLIENT_ID — ดูขั้นตอนใน README
      </div>
    );
  }

  return (
    <div>
      <div ref={slot} className="flex justify-center" />
      {error && <p className="mt-2 text-center text-xs text-red-600">{error}</p>}
    </div>
  );
}
