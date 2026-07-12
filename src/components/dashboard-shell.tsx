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
      <aside className="flex flex-row flex-wrap items-center gap-1 bg-navy px-3 py-3 text-[#B9C7E2] md:flex-col md:items-stretch md:gap-0 md:px-0 md:py-5">
        <Link href="/" className="px-3 pb-0 md:px-6 md:pb-4">
          <Logo size={24} onDark />
        </Link>
        {NAV.map((item) => (
          <Link
            key={item.key}
            href={item.href}
            className={`rounded-md px-3 py-2 text-sm md:rounded-none md:border-l-[3px] md:px-6 ${
              active === item.key
                ? "bg-white/10 font-bold text-white md:border-sky"
                : "hover:text-white md:border-transparent"
            }`}
          >
            {item.label}
          </Link>
        ))}
        <div className="mt-0 px-3 text-xs text-[#7E90B5] md:mt-auto md:border-t md:border-white/10 md:px-6 md:pt-4">
          <Link href="/dashboard" className="font-bold text-[#B9C7E2] hover:text-white">
            🏪 {shopName || "…"} ▾ สลับร้าน
          </Link>
          <button onClick={logout} className="mt-1 block hover:text-white">
            ออกจากระบบ
          </button>
        </div>
      </aside>
      <main className="px-6 py-7 md:px-9">{children}</main>
    </div>
  );
}
