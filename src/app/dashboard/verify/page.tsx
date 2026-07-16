"use client";

import jsQR from "jsqr";
import { useRef, useState } from "react";
import { DashboardShell } from "@/components/dashboard-shell";
import { api } from "@/lib/api";
import { bankName } from "@/lib/banks";
import { fmtBaht, fmtDateTime, STATUS_BADGE, VerificationRow } from "@/lib/verifications";

/** ถอด mini-QR จากรูปสลิปในเบราว์เซอร์ (ไม่ต้องส่งรูปขึ้น server) */
async function decodeQrFromImage(file: File): Promise<string | null> {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = reject;
      el.src = url;
    });
    // ลองหลายสเกล — QR เล็กเกินหรือรูปใหญ่เกิน jsQR อาจอ่านไม่เจอ
    for (const maxSide of [1200, 800, 1800]) {
      const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      const ctx = canvas.getContext("2d");
      if (!ctx) return null;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const result = jsQR(data.data, data.width, data.height);
      if (result?.data) return result.data;
    }
    return null;
  } finally {
    URL.revokeObjectURL(url);
  }
}

export default function VerifyPage() {
  const [payload, setPayload] = useState("");
  const [expectedAmount, setExpectedAmount] = useState("");
  const [result, setResult] = useState<VerificationRow | null>(null);
  const [busy, setBusy] = useState(false);
  const [decoding, setDecoding] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  async function onFile(file: File | undefined) {
    if (!file) return;
    setError(null);
    setDecoding(true);
    try {
      const decoded = await decodeQrFromImage(file);
      if (!decoded) {
        setError("อ่าน QR จากรูปไม่ได้ — ลองรูปที่คมชัดขึ้น หรือวางข้อความ payload โดยตรง");
        return;
      }
      setPayload(decoded);
    } finally {
      setDecoding(false);
      if (fileInput.current) fileInput.current.value = "";
    }
  }

  async function verify() {
    setConfirming(false);
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const record = await api<VerificationRow>("/shops/verifications", {
        method: "POST",
        shopScoped: true,
        body: {
          payload: payload.trim(),
          expected_amount: expectedAmount ? Number(expectedAmount) : undefined,
        },
        idempotencyKey: crypto.randomUUID(),
      });
      setResult(record);
    } catch (err) {
      setError(err instanceof Error ? err.message : "ตรวจไม่สำเร็จ");
    } finally {
      setBusy(false);
    }
  }

  return (
    <DashboardShell active="verify">
      <h1 className="text-xl font-extrabold">ตรวจสลิป</h1>
      <p className="mt-0.5 text-sm text-muted">
        ทดสอบตรวจจากหน้านี้ได้เลย — เงื่อนไขเดียวกับการยิงผ่าน API ทุกประการ (หัก 1 เครดิตเมื่อได้ผลสมบูรณ์)
      </p>

      {error && <p className="mt-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">{error}</p>}

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        {/* ฝั่งกรอกข้อมูล */}
        <div className="rounded-2xl border border-line bg-white p-6">
          <label className="block text-sm">
            <span className="mb-1 block font-bold">รูปสลิป (ถอด QR ให้อัตโนมัติในเครื่องคุณ — ไม่อัปโหลดรูปขึ้นระบบ)</span>
            <input
              ref={fileInput}
              type="file"
              accept="image/*"
              onChange={(e) => onFile(e.target.files?.[0])}
              className="w-full rounded-lg border border-dashed border-line px-3 py-3 text-xs text-muted file:mr-3 file:rounded-lg file:border-0 file:bg-blue file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-white"
            />
          </label>
          {decoding && <p className="mt-2 text-xs text-muted">กำลังถอด QR จากรูป…</p>}

          <div className="my-4 flex items-center gap-3 text-xs text-muted">
            <span className="h-px flex-1 bg-line" />หรือ<span className="h-px flex-1 bg-line" />
          </div>

          <label className="block text-sm">
            <span className="mb-1 block font-bold">ข้อความ payload จาก mini-QR</span>
            <textarea
              value={payload}
              onChange={(e) => setPayload(e.target.value)}
              rows={3}
              placeholder="00410006000001010300402200…"
              className="w-full rounded-lg border border-line px-3 py-2.5 font-mono text-xs outline-none focus:border-blue"
            />
          </label>

          <label className="mt-3 block text-sm">
            <span className="mb-1 block font-bold">ยอดที่คาดหวัง (บาท — ไม่บังคับ)</span>
            <input
              value={expectedAmount}
              onChange={(e) => setExpectedAmount(e.target.value)}
              inputMode="decimal"
              placeholder="เช่น 125.00"
              className="w-40 rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-blue tabular-nums"
            />
          </label>

          <button
            onClick={() => setConfirming(true)}
            disabled={busy || !payload.trim()}
            className="mt-5 w-full rounded-lg bg-blue py-2.5 font-bold text-white disabled:opacity-50"
          >
            {busy ? "กำลังตรวจ…" : "ตรวจสลิป (ใช้ 1 เครดิต)"}
          </button>
        </div>

        {/* ฝั่งผลลัพธ์ */}
        <div className="rounded-2xl border border-line bg-white p-6">
          <h2 className="text-sm font-bold">ผลการตรวจ</h2>
          {!result ? (
            <p className="mt-4 text-sm text-muted">ผลจะแสดงที่นี่หลังกดตรวจ</p>
          ) : (
            <div className="mt-4 space-y-2.5 text-sm">
              <div className="flex items-center gap-2">
                <span className={`rounded-full px-3 py-1 text-sm font-bold ${STATUS_BADGE[result.status].cls}`}>
                  {STATUS_BADGE[result.status].label}
                </span>
                {result.status === "duplicate" && <span className="text-xs text-muted">สลิปใบนี้เคยถูกตรวจแล้ว</span>}
              </div>
              <div className="grid grid-cols-[110px_1fr] gap-y-1.5 rounded-xl bg-paper px-4 py-3">
                <span className="text-muted">trans_ref</span><code className="font-mono text-xs">{result.trans_ref ?? "—"}</code>
                <span className="text-muted">ธนาคารต้นทาง</span><span>{result.sending_bank ? bankName(result.sending_bank) : "—"}</span>
                <span className="text-muted">จำนวนเงิน</span><b className="tabular-nums">{fmtBaht(result.amount)}</b>
                <span className="text-muted">ผู้รับ</span>
                <span>{result.receiver_name ?? "—"}<br /><code className="font-mono text-xs text-muted">{result.receiver_account ?? ""}</code></span>
                <span className="text-muted">เวลาตรวจ</span><span className="tabular-nums">{fmtDateTime(result.created_at)}</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {result.checks.amount_match !== undefined && (
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${result.checks.amount_match ? "bg-green/10 text-green" : "bg-red-50 text-red-700"}`}>
                    ยอดเงิน{result.checks.amount_match ? "ตรง" : "ไม่ตรง"}
                  </span>
                )}
                {result.checks.receiver_match !== undefined && (
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${result.checks.receiver_match ? "bg-green/10 text-green" : "bg-red-50 text-red-700"}`}>
                    ผู้รับ{result.checks.receiver_match ? "ตรงกับบัญชีร้าน" : "ไม่ตรงกับบัญชีร้าน"}
                  </span>
                )}
                {result.error_code && (
                  <span className="rounded-full bg-paper px-2.5 py-0.5 font-mono text-xs text-muted">{result.error_code}</span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* modal ยืนยัน (หักเครดิตจริง) */}
      {confirming && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-navy/50 px-4" onClick={() => setConfirming(false)}>
          <div className="w-full max-w-sm rounded-2xl bg-white p-7" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-extrabold">ยืนยันการตรวจสลิป</h2>
            <p className="mt-2 text-sm text-muted">
              การตรวจนี้เหมือนการใช้งานจริงทุกประการ — หัก <b className="text-ink">1 เครดิต</b> เมื่อได้ผลสมบูรณ์
              (QR อ่านไม่ได้/ระบบตรวจล่ม ไม่หักเครดิต)
            </p>
            <div className="mt-5 flex gap-2">
              <button onClick={() => setConfirming(false)} className="flex-1 rounded-lg border border-line py-2.5 text-sm font-bold hover:border-blue">
                ยกเลิก
              </button>
              <button onClick={verify} className="flex-1 rounded-lg bg-blue py-2.5 text-sm font-bold text-white">
                ตรวจเลย
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
