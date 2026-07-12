"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Logo } from "@/components/logo";
import { api, ApiError, session } from "@/lib/api";

interface Shop {
  id: string;
  name: string;
  status: string;
  role: string;
  balance: string;
}

/**
 * Dashboard เริ่มต้น (vertical slice): list ร้าน / สร้างร้านแรก / เลือกร้าน
 * — หน้าอื่นตาม mockup (API keys, เติมเครดิต, log, webhooks) จะต่อยอดจากตรงนี้
 */
export default function DashboardPage() {
  const router = useRouter();
  const [shops, setShops] = useState<Shop[] | null>(null);
  const [newShopName, setNewShopName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadShops = useCallback(async () => {
    try {
      setShops(await api<Shop[]>("/shops"));
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        session.clear();
        router.replace("/login");
        return;
      }
      setError(err instanceof Error ? err.message : "โหลดข้อมูลไม่สำเร็จ");
    }
  }, [router]);

  useEffect(() => {
    if (!session.token()) {
      router.replace("/login");
      return;
    }
    void loadShops();
  }, [router, loadShops]);

  async function createShop() {
    if (!newShopName.trim()) return;
    setBusy(true);
    setError(null);
    try {
      const created = await api<{ id: string; free_credits_granted: boolean }>("/shops", {
        method: "POST",
        body: { name: newShopName.trim() },
      });
      session.selectShop(created.id);
      setNewShopName("");
      // onboarding ตามสเปก: สร้างร้านแล้ว → เพิ่มบัญชีธนาคารทันที
      router.push("/dashboard/bank-accounts");
    } catch (err) {
      setError(err instanceof Error ? err.message : "สร้างร้านไม่สำเร็จ");
    } finally {
      setBusy(false);
    }
  }

  function logout() {
    session.clear();
    router.replace("/login");
  }

  return (
    <main className="min-h-screen">
      <header className="flex items-center gap-4 border-b border-line bg-white px-6 py-4 md:px-10">
        <Link href="/"><Logo size={26} /></Link>
        <button onClick={logout} className="ml-auto rounded-lg border border-line px-3 py-1.5 text-sm font-bold text-muted hover:text-ink">
          ออกจากระบบ
        </button>
      </header>

      <div className="mx-auto max-w-2xl px-6 py-10">
        {error && <p className="mb-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">{error}</p>}

        {shops === null ? (
          <p className="text-center text-muted">กำลังโหลด…</p>
        ) : shops.length === 0 ? (
          /* onboarding gate: ผู้ใช้ใหม่ต้องสร้างร้านก่อน (CLAUDE.md §4) */
          <div className="rounded-2xl border border-line bg-white p-8 text-center">
            <h1 className="text-xl font-extrabold">สร้างร้านแรกของคุณ 🏪</h1>
            <p className="mt-1 text-sm text-muted">ตั้งชื่อร้านเพื่อเริ่มใช้งาน — ร้านแรกรับฟรี 20 เครดิตทันที</p>
            <div className="mx-auto mt-5 flex max-w-sm gap-2">
              <input
                value={newShopName}
                onChange={(e) => setNewShopName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && createShop()}
                placeholder="เช่น ร้านป้อมขายดี"
                className="w-full rounded-lg border border-line px-3.5 py-2.5 text-sm outline-none focus:border-blue"
              />
              <button
                onClick={createShop}
                disabled={busy || !newShopName.trim()}
                className="rounded-lg bg-blue px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50"
              >
                {busy ? "กำลังสร้าง…" : "สร้างร้าน"}
              </button>
            </div>
          </div>
        ) : (
          <div>
            <h1 className="text-xl font-extrabold">ร้านค้าของฉัน</h1>
            <div className="mt-4 space-y-3">
              {shops.map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    session.selectShop(s.id);
                    router.push("/dashboard/overview");
                  }}
                  className={`flex w-full items-center gap-3 rounded-xl border bg-white p-5 text-left hover:border-blue ${session.shopId() === s.id ? "border-blue" : "border-line"}`}
                >
                  <span className="text-2xl">🏪</span>
                  <span>
                    <span className="font-bold">{s.name}</span>
                    <span className="block text-xs text-muted">{s.role === "owner" ? "เจ้าของร้าน" : "สมาชิก"} · สถานะ {s.status}</span>
                  </span>
                  <span className="ml-auto text-right">
                    <span className="block text-lg font-extrabold text-navy tabular-nums">{Number(s.balance).toLocaleString()}</span>
                    <span className="block text-xs text-muted">เครดิตคงเหลือ</span>
                  </span>
                </button>
              ))}
            </div>
            <div className="mt-6 flex gap-2">
              <input
                value={newShopName}
                onChange={(e) => setNewShopName(e.target.value)}
                placeholder="สร้างร้านเพิ่ม…"
                className="w-full rounded-lg border border-line px-3.5 py-2 text-sm outline-none focus:border-blue"
              />
              <button
                onClick={createShop}
                disabled={busy || !newShopName.trim()}
                className="rounded-lg border border-line px-4 py-2 text-sm font-bold disabled:opacity-50"
              >
                + สร้างร้าน
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
