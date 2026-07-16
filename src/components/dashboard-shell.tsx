"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api, session } from "@/lib/api";
import { Logo } from "./logo";

interface NavItem {
  key: string;
  label: string;
  /** null = ฟีเจอร์ในแผน ยังไม่เปิด (แสดง "เร็วๆ นี้") */
  href: string | null;
}

interface NavSection {
  title: string;
  /** แสดงเครดิตคงเหลือต่อท้ายหัวข้อ (แบบ quota ของ slip2go) */
  showBalance?: boolean;
  items: NavItem[];
}

/** โครงเมนูตาม slip2go (เจ้าของสั่ง 16 ก.ค. 2026 — ไม่มีหมวด E-Catalog) */
const SECTIONS: NavSection[] = [
  {
    title: "ร้านค้า",
    items: [
      { key: "overview", label: "📊 ภาพรวม", href: "/dashboard/overview" },
      { key: "bank-accounts", label: "🏦 บัญชีธนาคาร", href: "/dashboard/bank-accounts" },
      { key: "members", label: "👥 แอดมินร้าน", href: null },
      { key: "topup", label: "💳 เติมเครดิต", href: "/dashboard/topup" },
    ],
  },
  {
    title: "ตรวจสลิป",
    showBalance: true,
    items: [
      { key: "verify", label: "🔍 ตรวจสลิป", href: "/dashboard/verify" },
      { key: "verifications", label: "🧾 ประวัติการตรวจ", href: "/dashboard/verifications" },
      { key: "line", label: "💬 ตรวจผ่าน LINE", href: null },
    ],
  },
  {
    title: "API Connect",
    items: [
      { key: "api-keys", label: "🔑 API Keys", href: "/dashboard/api-keys" },
      { key: "webhooks", label: "🔔 Webhooks", href: "/dashboard/webhooks" },
      { key: "docs", label: "📖 เอกสาร API", href: null },
    ],
  },
];

/** โครงหน้า dashboard — sidebar โทนอ่อนแบบ A (ห้ามกลับไปพื้นเข้ม, CLAUDE.md §3) */
export function DashboardShell({ active, children }: { active: string; children: React.ReactNode }) {
  const router = useRouter();
  const [shopName, setShopName] = useState<string>("");
  const [balance, setBalance] = useState<string | null>(null);

  useEffect(() => {
    if (!session.token()) {
      router.replace("/login");
      return;
    }
    if (!session.shopId()) {
      router.replace("/dashboard");
      return;
    }
    void api<{ id: string; name: string; balance: string }[]>("/shops")
      .then((shops) => {
        const current = shops.find((s) => s.id === session.shopId());
        setShopName(current?.name ?? "");
        setBalance(current?.balance ?? null);
      })
      .catch(() => undefined);
  }, [router]);

  function logout() {
    session.clear();
    router.replace("/login");
  }

  return (
    <div className="grid min-h-screen md:grid-cols-[224px_1fr]">
      <aside className="flex flex-row flex-wrap items-center gap-1 border-b border-line bg-white px-3 py-3 md:flex-col md:items-stretch md:gap-0 md:border-b-0 md:border-r md:px-0 md:py-5">
        {/* โลโก้ใน dashboard พากลับหน้ารายการร้าน ไม่ใช่ออกไปหน้าเว็บ */}
        <Link href="/dashboard" className="px-3 pb-0 md:px-6 md:pb-3">
          <Logo size={24} />
        </Link>

        {SECTIONS.map((section) => (
          <div key={section.title} className="contents md:block">
            {/* หัวหมวด: font/ขนาดเดียวกับเมนูย่อย แต่หนา (ตาม feedback เจ้าของ 16 ก.ค.) */}
            <p className="hidden px-6 pb-1 pt-4 text-sm font-bold text-ink md:block">
              {section.title}
              {section.showBalance && balance !== null && (
                <span className="ml-1.5 text-sm font-bold text-green">({Number(balance).toLocaleString()} เครดิต)</span>
              )}
            </p>
            {section.items.map((item) =>
              item.href ? (
                <Link
                  key={item.key}
                  href={item.href}
                  className={`rounded-md px-3 py-2 text-sm md:block md:rounded-none md:border-l-[3px] md:px-6 ${
                    active === item.key
                      ? "bg-blue/10 font-bold text-blue md:border-blue"
                      : "text-muted hover:bg-paper hover:text-ink md:border-transparent"
                  }`}
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  key={item.key}
                  title="เร็วๆ นี้"
                  className="hidden cursor-not-allowed px-3 py-2 text-sm text-muted opacity-50 md:block md:border-l-[3px] md:border-transparent md:px-6"
                >
                  {item.label}
                  <span className="ml-2 rounded-full bg-paper px-2 py-0.5 text-[10px] font-bold">เร็วๆ นี้</span>
                </span>
              ),
            )}
          </div>
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
