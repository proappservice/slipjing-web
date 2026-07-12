"use client";

import { useCallback, useEffect, useState } from "react";
import { DashboardShell } from "@/components/dashboard-shell";
import { api } from "@/lib/api";
import { fmtBaht, fmtDateTime, STATUS_BADGE, VerificationRow } from "@/lib/verifications";
import { bankName } from "@/lib/banks";

const FILTERS = [
  { value: "", label: "ทั้งหมด" },
  { value: "verified", label: "ถูกต้อง" },
  { value: "duplicate", label: "สลิปซ้ำ" },
  { value: "failed", label: "ไม่ผ่าน" },
  { value: "invalid", label: "QR ไม่ถูกต้อง" },
] as const;

function CheckPill({ ok, label }: { ok: boolean | undefined; label: string }) {
  if (ok === undefined) return null;
  return (
    <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${ok ? "bg-green/10 text-green" : "bg-red-50 text-red-700"}`}>
      {label}
      {ok ? "ตรง" : "ไม่ตรง"}
    </span>
  );
}

export default function VerificationsPage() {
  const [rows, setRows] = useState<VerificationRow[] | null>(null);
  const [status, setStatus] = useState("");
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (statusFilter: string) => {
    setRows(null);
    try {
      const query = statusFilter ? `?status=${statusFilter}&limit=100` : "?limit=100";
      setRows(await api<VerificationRow[]>(`/shops/verifications${query}`, { shopScoped: true }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "โหลดข้อมูลไม่สำเร็จ");
    }
  }, []);

  useEffect(() => {
    void load(status);
  }, [load, status]);

  return (
    <DashboardShell active="verifications">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-xl font-extrabold">ประวัติการตรวจสลิป</h1>
        <div className="ml-auto flex gap-1.5">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setStatus(f.value)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-bold ${
                status === f.value ? "bg-navy text-white" : "border border-line bg-white text-muted hover:text-ink"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="mt-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">{error}</p>}

      <div className="mt-4 overflow-x-auto rounded-xl border border-line bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-muted">
              <th className="px-4 py-3">เวลา</th>
              <th className="px-4 py-3">trans_ref</th>
              <th className="px-4 py-3">ธนาคารต้นทาง</th>
              <th className="px-4 py-3">จำนวนเงิน</th>
              <th className="px-4 py-3">เช็ค</th>
              <th className="px-4 py-3">ผล</th>
            </tr>
          </thead>
          <tbody>
            {rows === null ? (
              <tr><td colSpan={6} className="px-4 py-6 text-center text-muted">กำลังโหลด…</td></tr>
            ) : rows.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-6 text-center text-muted">ไม่พบรายการ</td></tr>
            ) : (
              rows.map((r) => (
                <tr key={r.id} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 text-xs tabular-nums">{fmtDateTime(r.created_at)}</td>
                  <td className="px-4 py-3 font-mono text-xs">{r.trans_ref ?? "—"}</td>
                  <td className="px-4 py-3 text-xs">{r.sending_bank ? bankName(r.sending_bank) : "—"}</td>
                  <td className="px-4 py-3 tabular-nums">{fmtBaht(r.amount)}</td>
                  <td className="px-4 py-3">
                    <span className="flex flex-wrap gap-1">
                      <CheckPill ok={r.checks.amount_match} label="ยอด" />
                      <CheckPill ok={r.checks.receiver_match} label="ผู้รับ" />
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${STATUS_BADGE[r.status].cls}`}>
                      {STATUS_BADGE[r.status].label}
                    </span>
                    {r.status === "duplicate" && r.duplicate_of && (
                      <span className="block pt-0.5 text-[10px] text-muted">อ้างอิงการตรวจครั้งแรก</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-muted">แสดงล่าสุดไม่เกิน 100 รายการ · QR ไม่ถูกต้อง/ระบบล่ม ไม่ถูกหักเครดิต</p>
    </DashboardShell>
  );
}
