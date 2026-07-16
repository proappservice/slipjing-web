"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { Logo } from "@/components/logo";
import { api, session } from "@/lib/api";

function LineCallback() {
  const router = useRouter();
  const params = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const exchanged = useRef(false); // กัน React dev double-effect ยิงแลก code ซ้ำ

  useEffect(() => {
    if (exchanged.current) return;
    exchanged.current = true;

    const code = params.get("code");
    const state = params.get("state");
    const expectedState = sessionStorage.getItem("line_login_state");
    sessionStorage.removeItem("line_login_state");

    if (params.get("error")) {
      setError(params.get("error_description") ?? "การเข้าสู่ระบบถูกยกเลิก");
      return;
    }
    if (!code || !state || state !== expectedState) {
      setError("ข้อมูลยืนยันตัวตนไม่ถูกต้อง (state ไม่ตรง) — กรุณาลองใหม่จากหน้าเข้าสู่ระบบ");
      return;
    }

    api<{ token: string }>("/auth/line", {
      method: "POST",
      body: { code, redirect_uri: `${window.location.origin}/auth/line/callback` },
    })
      .then((result) => {
        session.save(result.token);
        router.replace("/dashboard");
      })
      .catch((err) => setError(err instanceof Error ? err.message : "เข้าสู่ระบบไม่สำเร็จ"));
  }, [params, router]);

  return (
    <main className="grid min-h-screen place-items-center bg-paper px-5">
      <div className="w-full max-w-[400px] rounded-2xl border border-line bg-white p-8 text-center">
        <div className="flex justify-center"><Logo size={30} /></div>
        {error ? (
          <>
            <p className="mt-5 text-sm text-red-700">{error}</p>
            <Link href="/login" className="mt-4 inline-block rounded-lg border border-line px-5 py-2 text-sm font-bold hover:border-blue">
              กลับหน้าเข้าสู่ระบบ
            </Link>
          </>
        ) : (
          <p className="mt-5 text-sm text-muted">กำลังเข้าสู่ระบบด้วย LINE…</p>
        )}
      </div>
    </main>
  );
}

export default function LineCallbackPage() {
  return (
    <Suspense fallback={null}>
      <LineCallback />
    </Suspense>
  );
}
