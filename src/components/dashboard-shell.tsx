"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api, session } from "@/lib/api";
import { Logo } from "./logo";

const NAV = [
  { key: "overview", label: "📊 ภาพรวม", href: "/dashboard/overview" },
  { key: "bank-accounts", label: "🏦 บัญชีธนาคาร", href: "/dashboard/bank-accounts" },
  { key: "api-keys", label: "🔑 API Keys", href: "/dashboard/api-keys" },
  { key: "topup", label: "💳 เติมเครดิต", href: "/dashboard/topup" },
  { key: "verifications", label: "🧾 ประวัติการตรวจ", href: "/dashboard/verifications" },
  { key: "webhooks", label: "🔔 Webhooks", href: "/dashboard/webhooks" },
] as const;

/** โครงหน้า dashboard (sidebar ตาม mockup) — ทุกหน้าหลังเลือกร้านใช้ตัวนี้ */
export function DashboardShell({ active, children }: { active: string; children: React.ReactNode }) {
  const router = useRouter();
  const [shopName, setShopName] = useState<string>("");

  useEffect(() => {
    if (!session.token()) {
      router.replace("/login");
      return;
    }
    if (!session.shopId()) {
      router.replace("/dashboard");
      return;
    }
    void api<{ id: string; name: string }[]>("/shops")
      .then((shops) => setShopName(shops.find((s) => s.id === session.shopId())?.name ?? ""))
      .catch(() => undefined);
  }, [router]);

  function logout() {
    session.clear();
    router.replace("/login");
  }

  return (
    <div className="grid min-h-screen md:grid-cols-[216px_1fr]">
      {/* แบบ A (เจ้าของเลือก 12 ก.ค. 2026): sidebar ขาว + เส้นคั่น อ่านง่ายกว่าพื้นเข้ม */}
      <aside className="flex flex-row flex-wrap items-center gap-1 border-b border-line bg-white px-3 py-3 md:flex-col md:items-stretch md:gap-0 md:border-b-0 md:border-r md:px-0 md:py-5">
        {/* โลโก้ใน dashboard พากลับหน้ารายการร้าน ไม่ใช่ออกไปหน้าเว็บ */}
        <Link href="/dashboard" className="px-3 pb-0 md:px-6 md:pb-4">
          <Logo size={24} />
        </Link>
        {NAV.map((item) => (
          <Link
            key={item.key}
            href={item.href}
            className={`rounded-md px-3 py-2 text-sm md:rounded-none md:border-l-[3px] md:px-6 ${
              active === item.key
                ? "bg-blue/10 font-bold text-blue md:border-blue"
                : "text-muted hover:bg-paper hover:text-ink md:border-transparent"
            }`}
          >
            {item.label}
          </Link>
        ))}
        <div className="mt-0 px-3 text-xs text-muted md:mt-auto md:border-t md:border-line md:px-6 md:pt-4">
          <Link href="/dashboard" className="font-bold text-ink hover:text-blue">
            🏪 {shopName || "…"} ▾ สลับร้าน
          </Link>
          <button onClick={logout} className="mt-1 block hover:text-ink">
            ออกจากระบบ
          </button>
        </div>
      </aside>
      <main className="px-6 py-7 md:px-9">{children}</main>
    </div>
  );
}
