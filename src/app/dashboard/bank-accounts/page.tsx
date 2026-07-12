"use client";

import { useCallback, useEffect, useState } from "react";
import { DashboardShell } from "@/components/dashboard-shell";
import { api } from "@/lib/api";
import { bankName, THAI_BANKS } from "@/lib/banks";

interface BankAccount {
  id: string;
  bankCode: string;
  accountNumber: string;
  accountNameTh: string;
  accountNameEn: string | null;
  verifyMode: "number" | "name" | "both";
  active: boolean;
}

const VERIFY_MODES = [
  { value: "both", label: "ตรวจทั้งเลขบัญชีและชื่อ (แนะนำ)" },
  { value: "number", label: "ตรวจเลขบัญชีอย่างเดียว" },
  { value: "name", label: "ตรวจชื่อบัญชีอย่างเดียว" },
] as const;

const VERIFY_MODE_LABEL: Record<BankAccount["verifyMode"], string> = {
  both: "เลขบัญชี + ชื่อ",
  number: "เลขบัญชี",
  name: "ชื่อบัญชี",
};

const EMPTY_FORM = { bank_code: "004", account_number: "", account_name_th: "", account_name_en: "", verify_mode: "both" };

export default function BankAccountsPage() {
  const [accounts, setAccounts] = useState<BankAccount[] | null>(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const all = await api<BankAccount[]>("/shops/bank-accounts", { shopScoped: true });
      setAccounts(all.filter((a) => a.active));
    } catch (err) {
      setError(err instanceof Error ? err.message : "โหลดข้อมูลไม่สำเร็จ");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const set = (k: keyof typeof EMPTY_FORM) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function add() {
    setBusy(true);
    setError(null);
    try {
      await api("/shops/bank-accounts", {
        method: "POST",
        shopScoped: true,
        body: {
          bank_code: form.bank_code,
          account_number: form.account_number.replace(/[^0-9]/g, ""),
          account_name_th: form.account_name_th.trim(),
          account_name_en: form.account_name_en.trim() || undefined,
          verify_mode: form.verify_mode,
        },
      });
      setForm({ ...EMPTY_FORM });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "เพิ่มบัญชีไม่สำเร็จ");
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("นำบัญชีนี้ออกจากการตรวจสอบ?")) return;
    try {
      await api(`/shops/bank-accounts/${id}`, { method: "DELETE", shopScoped: true });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "ลบบัญชีไม่สำเร็จ");
    }
  }

  const formValid = /^\d{6,15}$/.test(form.account_number.replace(/[^0-9]/g, "")) && form.account_name_th.trim().length > 0;

  return (
    <DashboardShell active="bank-accounts">
      <h1 className="text-xl font-extrabold">บัญชีธนาคาร</h1>
      <p className="mt-0.5 text-sm text-muted">
        บัญชีรับเงินของร้าน — ระบบใช้เทียบ &ldquo;ผู้รับเงินบนสลิป&rdquo; ให้อัตโนมัติทุกครั้งที่ตรวจ (เพิ่มได้หลายบัญชี)
      </p>

      {error && <p className="mt-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">{error}</p>}

      {/* รายการบัญชี */}
      <div className="mt-5 space-y-3">
        {accounts === null ? (
          <p className="text-muted">กำลังโหลด…</p>
        ) : accounts.length === 0 ? (
          <div className="rounded-xl border border-dashed border-line bg-white p-6 text-center text-sm text-muted">
            ยังไม่มีบัญชี — เพิ่มบัญชีแรกด้านล่างเพื่อเริ่มตรวจสลิปแบบเช็คผู้รับอัตโนมัติ
          </div>
        ) : (
          accounts.map((a) => (
            <div key={a.id} className="flex flex-wrap items-center gap-3 rounded-xl border border-line bg-white p-5">
              <span className="text-2xl">🏦</span>
              <span>
                <span className="font-bold tabular-nums">{a.accountNumber}</span>
                <span className="block text-xs text-muted">{bankName(a.bankCode)}</span>
              </span>
              <span className="ml-2">
                <span className="text-sm font-bold">{a.accountNameTh}</span>
                {a.accountNameEn && <span className="block text-xs text-muted">({a.accountNameEn})</span>}
              </span>
              <span className="ml-auto rounded-full bg-blue/10 px-3 py-1 text-xs font-bold text-blue">
                ตรวจ: {VERIFY_MODE_LABEL[a.verifyMode]}
              </span>
              <button onClick={() => remove(a.id)} className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-bold text-red-700 hover:bg-red-100">
                นำออก
              </button>
            </div>
          ))
        )}
      </div>

      {/* ฟอร์มเพิ่มบัญชี */}
      <div className="mt-7 max-w-xl rounded-2xl border border-line bg-white p-6">
        <h2 className="font-bold">+ เพิ่มบัญชี</h2>
        <div className="mt-4 space-y-3.5 text-sm">
          <label className="block">
            <span className="mb-1 block font-bold">ธนาคาร *</span>
            <select value={form.bank_code} onChange={set("bank_code")} className="w-full rounded-lg border border-line bg-white px-3 py-2.5 outline-none focus:border-blue">
              {THAI_BANKS.map((b) => (
                <option key={b.code} value={b.code}>{b.name}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-1 block font-bold">เลขที่บัญชี *</span>
            <input value={form.account_number} onChange={set("account_number")} placeholder="เช่น 1062346113" inputMode="numeric"
              className="w-full rounded-lg border border-line px-3 py-2.5 outline-none focus:border-blue" />
          </label>
          <label className="block">
            <span className="mb-1 block font-bold">ชื่อ-นามสกุล ภาษาไทย (ห้ามใส่คำนำหน้า) *</span>
            <input value={form.account_name_th} onChange={set("account_name_th")} placeholder="เช่น ภาคภูมิ พูลนาผล"
              className="w-full rounded-lg border border-line px-3 py-2.5 outline-none focus:border-blue" />
          </label>
          <label className="block">
            <span className="mb-1 block font-bold">ชื่อ-นามสกุล ภาษาอังกฤษ (ถ้ามี)</span>
            <input value={form.account_name_en} onChange={set("account_name_en")} placeholder="เช่น Pakpoom Poolnaphol"
              className="w-full rounded-lg border border-line px-3 py-2.5 outline-none focus:border-blue" />
          </label>
          <label className="block">
            <span className="mb-1 block font-bold">รูปแบบการตรวจสอบบัญชี</span>
            <select value={form.verify_mode} onChange={set("verify_mode")} className="w-full rounded-lg border border-line bg-white px-3 py-2.5 outline-none focus:border-blue">
              {VERIFY_MODES.map((m) => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
          </label>
          <button onClick={add} disabled={busy || !formValid}
            className="w-full rounded-lg bg-blue py-2.5 font-bold text-white disabled:opacity-50">
            {busy ? "กำลังบันทึก…" : "ยืนยัน"}
          </button>
        </div>
      </div>
    </DashboardShell>
  );
}
