import { QrPattern } from "./qr-pattern";

/** ภาพมือถือแสดงสลิป + การ์ดผลตรวจลอยประกบ — port ตรงจาก mockup ที่ approve แล้ว */
export function HeroPhone() {
  return (
    <div className="relative flex justify-center py-4 md:pr-8">
      <div className="relative w-[248px] rounded-[34px] border border-[#2B3D61] bg-[#0D1526] p-3 shadow-[0_24px_60px_rgba(4,10,24,.5)]">
        {/* notch */}
        <div className="absolute left-1/2 top-3 z-10 h-[18px] w-[84px] -translate-x-1/2 rounded-b-xl bg-[#0D1526]" />

        {/* ป้ายลอย */}
        <span className="animate-bob absolute -left-2 top-6 z-10 rounded-full bg-white px-3.5 py-1.5 text-xs font-bold text-navy shadow-[0_10px_26px_rgba(4,10,24,.35)] md:-left-6" style={{ animationDelay: "0.8s" }}>
          🛡️ จับสลิปซ้ำอัตโนมัติ
        </span>
        <span className="animate-bob absolute -bottom-1.5 left-1 z-10 rounded-full bg-white px-3.5 py-1.5 text-xs font-bold text-navy shadow-[0_10px_26px_rgba(4,10,24,.35)]" style={{ animationDelay: "1.6s" }}>
          ⚡ รู้ผลใน ~1 วินาที
        </span>

        {/* หน้าจอ + สลิป */}
        <div className="rounded-3xl bg-[#EDF1F7] px-3 pb-4 pt-8">
          <div className="rounded-xl bg-white p-3.5 text-[11px] leading-relaxed text-ink shadow-[0_2px_8px_rgba(10,20,40,.08)]">
            <div className="border-b border-dashed border-line pb-2.5 text-center">
              <span className="mx-auto flex h-[34px] w-[34px] items-center justify-center rounded-full bg-green text-lg font-extrabold text-white">✓</span>
              <p className="mt-1 text-[13px] font-bold text-green">โอนเงินสำเร็จ</p>
              <p className="text-[10px] text-muted">11 ก.ค. 2026 · 14:52 น.</p>
            </div>
            <div className="mt-2.5 flex justify-between gap-2">
              <span className="text-muted">จาก</span>
              <span className="text-right font-bold">นายสมชาย ใ.<br />ธ.กสิกรไทย xxx-x-x5678-x</span>
            </div>
            <div className="mt-1.5 flex justify-between gap-2">
              <span className="text-muted">ไปยัง</span>
              <span className="text-right font-bold">ร้านป้อมขายดี<br />ธ.ไทยพาณิชย์ xxx-x-x1234-x</span>
            </div>
            <div className="mt-2 flex items-baseline justify-between border-t border-dashed border-line pt-2">
              <span className="text-muted">จำนวนเงิน</span>
              <span className="text-[17px] font-extrabold text-navy">1,500.00 บาท</span>
            </div>
            <div className="mt-2.5 flex items-center gap-2">
              <QrPattern seed={7} className="h-[42px] w-[42px] flex-none" />
              <span className="text-[9px] leading-snug text-[#9AA4B8]">เลขที่รายการ<br />0141A2K9X4TQ88</span>
            </div>
          </div>
        </div>

        {/* การ์ดผลตรวจ */}
        <div className="animate-bob absolute -right-2 bottom-[52px] z-10 flex items-center gap-2.5 rounded-xl bg-white px-4 py-2.5 text-xs leading-snug text-ink shadow-[0_14px_36px_rgba(4,10,24,.4)] md:-right-[84px]">
          <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-green font-extrabold text-white">✓</span>
          <span>
            <b className="text-green">สลิปจริง · ยอดตรงกัน</b>
            <br />
            <span className="text-[10.5px] text-muted">ตรวจโดย SlipJing ใน 1.2 วิ · ไม่พบการใช้ซ้ำ</span>
          </span>
        </div>
      </div>
    </div>
  );
}
