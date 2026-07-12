"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { DashboardShell } from "@/components/dashboard-shell";
import { api } from "@/lib/api";
import { fmtBaht, fmtDateTime, STATUS_BADGE, VerificationRow } from "@/lib/verifications";

interface UsageDay {
  date: string;
  total: number;
  verified: number;
  duplicates: number;
}

const THAI_DAY = ["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"];

export default function OverviewPage() {
  const [balance, setBalance] = useState<string | null>(null);
  const [usage, setUsage] = useState<UsageDay[] | null>(null);
  const [recent, setRecent] = useState<VerificationRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      api<{ balance: string }>("/shops/credits/balance", { shopScoped: true }),
      api<UsageDay[]>("/shops/verifications/usage", { shopScoped: true }),
      api<VerificationRow[]>("/shops/verifications?limit=8", { shopScoped: true }),
    ])
      .then(([b, u, r]) => {
        setBalance(b.balance);
        setUsage(u);
        setRecent(r);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "โหลดข้อมูลไม่สำเร็จ"));
  }, []);

  // เติมวันที่หายให้ครบ 7 วันล่าสุด (วันไม่มีการตรวจ = 0)
  const days: UsageDay[] = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(Date.now() - (6 - i) * 24 * 3600 * 1000);
    const key = d.toISOString().slice(0, 10);
    return usage?.find((u) => u.date === key) ?? { date: key, total: 0, verified: 0, duplicates: 0 };
  });
  const maxTotal = Math.max(1, ...days.map((d) => d.total));
  const totals7d = days.reduce((s, d) => s + d.total, 0);
  const dup7d = days.reduce((s, d) => s + d.duplicates, 0);
  const verified7d = days.reduce((s, d) => s + d.verified, 0);
  const today = days[days.length - 1];

  return (
    <DashboardShell active="overview">
      <h1 className="text-xl font-extrabold">ภาพรวม</h1>
      {error && <p className="mt-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">{error}</p>}

      {/* stat tiles */}
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-line bg-white px-5 py-4">
          <p className="text-xs font-bold text-muted">เครดิตคงเหลือ</p>
          <p className="text-2xl font-extrabold text-navy tabular-nums">{balance === null ? "…" : Number(balance).toLocaleString()}</p>
          <Link href="/dashboard/topup" className="text-xs font-bold text-blue hover:underline">+ เติมเครดิต</Link>
        </div>
        <div className="rounded-xl border border-line bg-white px-5 py-4">
          <p className="text-xs font-bold text-muted">ตรวจวันนี้</p>
          <p className="text-2xl font-extrabold tabular-nums">{usage === null ? "…" : today.total}</p>
          <p className="text-xs text-muted">ครั้ง</p>
        </div>
        <div className="rounded-xl border border-line bg-white px-5 py-4">
          <p className="text-xs font-bold text-muted">สลิปซ้ำที่จับได้ (7 วัน)</p>
          <p className="text-2xl font-extrabold text-amber-600 tabular-nums">{usage === null ? "…" : dup7d}</p>
          <p className="text-xs text-muted">ใบ — กันความเสียหายให้ร้าน</p>
        </div>
        <div className="rounded-xl border border-line bg-white px-5 py-4">
          <p className="text-xs font-bold text-muted">อัตราสลิปถูกต้อง (7 วัน)</p>
          <p className="text-2xl font-extrabold text-green tabular-nums">
            {usage === null ? "…" : totals7d === 0 ? "—" : `${Math.round((verified7d / totals7d) * 100)}%`}
          </p>
          <p className="text-xs text-muted">จากทั้งหมด {totals7d} ครั้ง</p>
        </div>
      </div>

      {/* bar chart 7 วัน */}
      <div className="mt-4 rounded-xl border border-line bg-white p-5">
        <h2 className="text-sm font-bold">การตรวจสลิป 7 วันล่าสุด</h2>
        <div className="mt-3 grid h-36 grid-cols-7 items-end gap-2.5" role="img" aria-label="กราฟจำนวนการตรวจสลิปรายวัน 7 วันล่าสุด">
          {days.map((d, i) => {
            const isToday = i === days.length - 1;
            return (
              <div key={d.date} className="group relative flex h-full flex-col justify-end" title={`${d.date} · ${d.total} ครั้ง`}>
                {isToday && d.total > 0 && (
                  <span className="mb-1 text-center text-[11px] font-extrabold tabular-nums">{d.total}</span>
                )}
                <div
                  className={`min-h-1 rounded-t ${isToday ? "bg-navy" : "bg-blue"} group-hover:opacity-80`}
                  style={{ height: `${(d.total / maxTotal) * 100}%` }}
                />
              </div>
            );
          })}
        </div>
        <div className="mt-1.5 grid grid-cols-7 gap-2.5 text-center text-[11px] text-muted">
          {days.map((d, i) => (
            <span key={d.date}>{i === days.length - 1 ? "วันนี้" : THAI_DAY[new Date(d.date).getDay()]}</span>
          ))}
        </div>
      </div>

      {/* รายการล่าสุด */}
      <div className="mt-4 overflow-x-auto rounded-xl border border-line bg-white">
        <div className="flex items-center px-5 pt-4">
          <h2 className="text-sm font-bold">การตรวจล่าสุด</h2>
          <Link href="/dashboard/verifications" className="ml-auto text-xs font-bold text-blue hover:underline">ดูทั้งหมด →</Link>
        </div>
        <table className="mt-2 w-full text-sm">
          <tbody>
            {recent === null ? (
              <tr><td className="px-5 py-5 text-center text-muted">กำลังโหลด…</td></tr>
            ) : recent.length === 0 ? (
              <tr><td className="px-5 py-5 text-center text-muted">ยังไม่มีการตรวจ — สร้าง API key แล้วเริ่มยิง /v1/verify ได้เลย</td></tr>
            ) : (
              recent.map((r) => (
                <tr key={r.id} className="border-t border-line">
                  <td className="px-5 py-2.5 text-xs text-muted tabular-nums">{fmtDateTime(r.created_at)}</td>
                  <td className="px-3 py-2.5 font-mono text-xs">{r.trans_ref ?? "—"}</td>
                  <td className="px-3 py-2.5 tabular-nums">{fmtBaht(r.amount)}</td>
                  <td className="px-3 py-2.5">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${STATUS_BADGE[r.status].cls}`}>
                      {STATUS_BADGE[r.status].label}
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
