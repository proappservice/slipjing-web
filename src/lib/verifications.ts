/** โครง response ของ verification จาก backend + ป้ายสถานะภาษาไทย */

export interface VerificationRow {
  id: string;
  status: "pending" | "verified" | "failed" | "invalid" | "duplicate";
  trans_ref: string | null;
  sending_bank: string | null;
  amount: string | null;
  receiver_account: string | null;
  receiver_name: string | null;
  checks: { amount_match?: boolean; receiver_match?: boolean };
  duplicate_of: string | null;
  error_code: string | null;
  created_at: string;
}

export const STATUS_BADGE: Record<VerificationRow["status"], { label: string; cls: string }> = {
  verified: { label: "ถูกต้อง", cls: "bg-green/10 text-green" },
  duplicate: { label: "สลิปซ้ำ", cls: "bg-amber-100 text-amber-700" },
  failed: { label: "ไม่ผ่าน", cls: "bg-red-50 text-red-700" },
  invalid: { label: "QR ไม่ถูกต้อง", cls: "bg-red-50 text-red-700" },
  pending: { label: "กำลังตรวจ", cls: "bg-paper text-muted" },
};

export const fmtDateTime = (iso: string) =>
  new Date(iso).toLocaleString("th-TH", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

export const fmtBaht = (amount: string | null) =>
  amount === null ? "—" : `฿${Number(amount).toLocaleString("th-TH", { minimumFractionDigits: 2 })}`;
