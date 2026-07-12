"use client";

import { useCallback, useEffect, useState } from "react";
import { DashboardShell } from "@/components/dashboard-shell";
import { api } from "@/lib/api";
import { fmtDateTime } from "@/lib/verifications";

interface CreditPackage {
  id: string;
  name: string;
  credits: string;
  price_thb: string;
}

interface TopupOrder {
  id: string;
  payment_ref: string | null;
  amount_thb: string;
  credits: string;
  status: "pending" | "paid" | "expired";
  created_at: string;
}

const ORDER_BADGE: Record<TopupOrder["status"], { label: string; cls: string }> = {
  pending: { label: "รอชำระ/รออนุมัติ", cls: "bg-amber-100 text-amber-700" },
  paid: { label: "เติมแล้ว", cls: "bg-green/10 text-green" },
  expired: { label: "หมดอายุ", cls: "bg-paper text-muted" },
};

export default function TopupPage() {
  const [packages, setPackages] = useState<CreditPackage[] | null>(null);
  const [orders, setOrders] = useState<TopupOrder[] | null>(null);
  const [createdOrder, setCreatedOrder] = useState<TopupOrder | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const [pkgs, ords] = await Promise.all([
        api<CreditPackage[]>("/shops/topup/packages", { shopScoped: true }),
        api<TopupOrder[]>("/shops/topup/orders", { shopScoped: true }),
      ]);
      setPackages(pkgs);
      setOrders(ords);
    } catch (err) {
      setError(err instanceof Error ? err.message : "โหลดข้อมูลไม่สำเร็จ");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function order(pkg: CreditPackage) {
    setBusy(true);
    setError(null);
    try {
      const created = await api<TopupOrder>("/shops/topup/orders", {
        method: "POST",
        shopScoped: true,
        body: { package_id: pkg.id },
      });
      setCreatedOrder(created);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "สร้างคำสั่งซื้อไม่สำเร็จ");
    } finally {
      setBusy(false);
    }
  }

  return (
    <DashboardShell active="topup">
      <h1 className="text-xl font-extrabold">เติมเครดิต</h1>
      <p className="mt-0.5 text-sm text-muted">1 เครดิต = ตรวจสลิป 1 ครั้ง · เครดิตไม่มีวันหมดอายุ</p>

      {error && <p className="mt-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">{error}</p>}

      {createdOrder && (
        <div className="mt-5 rounded-xl border border-blue bg-blue/5 px-5 py-4 text-sm">
          <p className="font-bold">📋 คำสั่งซื้อ {createdOrder.payment_ref} — ฿{Number(createdOrder.amount_thb).toLocaleString()}</p>
          <p className="mt-1 text-muted">
            โอนเงินตามยอดมาที่บัญชีร้าน แล้วแจ้งเลขคำสั่งซื้อนี้ — ระบบชำระอัตโนมัติผ่าน PromptPay QR + อัปโหลดสลิป
            กำลังจะเปิดใช้เร็วๆ นี้ ระหว่างนี้ทีมงานจะอนุมัติให้ภายใน 24 ชม.
          </p>
        </div>
      )}

      {/* แพ็กเกจ */}
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {packages === null ? (
          <p className="text-muted">กำลังโหลด…</p>
        ) : (
          packages.map((p, i) => (
            <div key={p.id} className={`relative rounded-2xl border bg-white p-6 text-center ${i === 1 ? "border-blue shadow-md shadow-blue/10" : "border-line"}`}>
              {i === 1 && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-blue px-3 py-0.5 text-xs font-bold text-white">คุ้มที่สุด</span>
              )}
              <h2 className="font-bold">{p.name}</h2>
              <p className="mt-1 text-3xl font-extrabold text-navy">฿{Number(p.price_thb).toLocaleString()}</p>
              <p className="text-sm text-muted">
                {Number(p.credits).toLocaleString()} เครดิต · ฿{(Number(p.price_thb) / Number(p.credits)).toFixed(2)}/ครั้ง
              </p>
              <button
                onClick={() => order(p)}
                disabled={busy}
                className={`mt-4 rounded-lg px-5 py-2 text-sm font-bold disabled:opacity-50 ${i === 1 ? "bg-blue text-white" : "border border-line hover:border-blue"}`}
              >
                เลือกแพ็กเกจ
              </button>
            </div>
          ))
        )}
      </div>

      {/* ประวัติคำสั่งซื้อ */}
      <h2 className="mt-8 text-sm font-bold">ประวัติการเติมเครดิต</h2>
      <div className="mt-2 overflow-x-auto rounded-xl border border-line bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-muted">
              <th className="px-4 py-3">เวลา</th>
              <th className="px-4 py-3">เลขคำสั่งซื้อ</th>
              <th className="px-4 py-3">ยอด</th>
              <th className="px-4 py-3">เครดิต</th>
              <th className="px-4 py-3">สถานะ</th>
            </tr>
          </thead>
          <tbody>
            {orders === null ? (
              <tr><td colSpan={5} className="px-4 py-6 text-center text-muted">กำลังโหลด…</td></tr>
            ) : orders.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-6 text-center text-muted">ยังไม่เคยเติมเครดิต</td></tr>
            ) : (
              orders.map((o) => (
                <tr key={o.id} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 text-xs tabular-nums">{fmtDateTime(o.created_at)}</td>
                  <td className="px-4 py-3 font-mono text-xs">{o.payment_ref}</td>
                  <td className="px-4 py-3 tabular-nums">฿{Number(o.amount_thb).toLocaleString()}</td>
                  <td className="px-4 py-3 tabular-nums">{Number(o.credits).toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${ORDER_BADGE[o.status].cls}`}>
                      {ORDER_BADGE[o.status].label}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </DashboardShell>
  );
}
