import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "ราคา — SlipJing ตรวจสลิปจ่ายเท่าที่ใช้จริง ไม่มีรายเดือน",
  description:
    "แพ็กเกจเครดิตตรวจสลิป เริ่มต้น ฿1 ต่อครั้ง เติมผ่าน PromptPay เครดิตไม่มีวันหมดอายุ สมัครใหม่รับฟรี 20 เครดิต",
};

const PACKAGES = [
  { name: "เริ่มต้น", price: "฿150", credits: "100 เครดิต", unit: "฿1.50 / การตรวจ", hot: false, cta: "เลือกแพ็กเกจ" },
  { name: "ร้านค้า", price: "฿600", credits: "500 เครดิต", unit: "฿1.20 / การตรวจ", hot: true, cta: "เลือกแพ็กเกจ" },
  { name: "ธุรกิจ", price: "฿2,000", credits: "2,000 เครดิต", unit: "฿1.00 / การตรวจ", hot: false, cta: "เลือกแพ็กเกจ" },
  { name: "องค์กร / ปริมาณสูง", price: "คุยกับเรา", credits: "มากกว่า 10,000 ครั้ง/เดือน", unit: "ราคาพิเศษตามปริมาณ", hot: false, cta: "ติดต่อทีมงาน", contact: true },
];

const INCLUDED = [
  "ตรวจสลิปได้ทุกธนาคารไทย",
  "จับสลิปซ้ำอัตโนมัติ (กันโกงซ้ำ)",
  "ตรวจยอดเงิน/บัญชีผู้รับตรงกัน",
  "Webhook แจ้งผลพร้อมลายเซ็น HMAC",
  "สร้างได้หลายร้าน หลายบัญชีธนาคาร",
  "API key ไม่จำกัดจำนวน",
  "Dashboard ภาษาไทย + log ย้อนหลัง",
  "หักเครดิตเฉพาะการตรวจที่สำเร็จ",
];

const FAQ = [
  {
    q: "เครดิตมีวันหมดอายุไหม?",
    a: "ไม่มี — เติมแล้วใช้ได้ตลอดจนกว่าจะหมด ไม่มีค่ารายเดือนหรือค่าธรรมเนียมแฝง",
  },
  {
    q: "ระบบหักเครดิตเมื่อไหร่บ้าง?",
    a: "หัก 1 เครดิตเฉพาะเมื่อการตรวจได้ผลลัพธ์สมบูรณ์ (สลิปจริง สลิปไม่ถูกต้อง หรือสลิปซ้ำ) — ถ้า QR อ่านไม่ได้ หรือระบบธนาคารต้นทางล่ม จะไม่หักเครดิต และถ้าหักไปแล้วตรวจไม่สำเร็จ ระบบคืนเครดิตอัตโนมัติ",
  },
  {
    q: "ทำไมสลิปซ้ำถึงคิดเครดิต?",
    a: "เพราะ “การจับได้ว่าสลิปถูกใช้ซ้ำ” คือผลการตรวจที่มีค่าที่สุด — เป็นรูปแบบการโกงอันดับหนึ่ง ระบบตอบพร้อมอ้างอิงว่าสลิปใบนี้เคยถูกใช้เมื่อไหร่",
  },
  {
    q: "เติมเครดิตอย่างไร?",
    a: "เลือกแพ็กเกจ → สแกน PromptPay QR → อัปโหลดสลิปโอน — ระบบตรวจสลิปของคุณด้วย engine เดียวกับที่ให้บริการ แล้วเติมเครดิตอัตโนมัติภายในไม่กี่วินาที",
  },
  {
    q: "ต้องการใบกำกับภาษี?",
    a: "แจ้งข้อมูลบริษัทในหน้าตั้งค่าร้าน ระบบออกใบเสร็จ/ใบกำกับภาษีให้ทุกยอดเติม (เร็วๆ นี้)",
  },
];

export default function PricingPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <SiteHeader active="pricing" />

      <section className="px-6 pt-12 text-center md:px-10">
        <h1 className="text-3xl font-extrabold text-navy text-balance">จ่ายเท่าที่ใช้จริง ไม่มีรายเดือน</h1>
        <p className="mt-2 text-sm text-muted">
          1 เครดิต = ตรวจสลิป 1 ครั้ง · เติมล่วงหน้าผ่าน PromptPay · เครดิตไม่มีวันหมดอายุ (ราคาตัวอย่าง)
        </p>
        <div className="mx-auto mt-6 max-w-xl rounded-xl border border-green bg-green/10 px-5 py-2.5 text-sm font-bold text-green">
          🎁 สมัครใหม่รับฟรี 20 เครดิต ทดลองใช้ได้ทันที — ไม่ต้องผูกบัตร
        </div>
      </section>

      <section className="mx-auto mt-9 grid w-full max-w-5xl gap-4 px-6 sm:grid-cols-2 lg:grid-cols-4 md:px-10">
        {PACKAGES.map((p) => (
          <div
            key={p.name}
            className={`relative rounded-2xl border bg-white p-6 text-center ${p.hot ? "border-blue shadow-lg shadow-blue/10" : "border-line"}`}
          >
            {p.hot && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-blue px-3 py-0.5 text-xs font-bold text-white">
                คุ้มที่สุด
              </span>
            )}
            <h2 className="text-[15px] font-bold">{p.name}</h2>
            <p className={`mt-1 font-extrabold text-navy ${"contact" in p && p.contact ? "pt-1.5 text-xl" : "text-3xl"}`}>{p.price}</p>
            <p className="text-sm text-muted">{p.credits}</p>
            <p className="mt-0.5 text-xs text-muted">{p.unit}</p>
            <a
              href="#"
              className={`mt-4 inline-block rounded-lg px-4 py-1.5 text-sm font-bold ${p.hot ? "bg-blue text-white" : "border border-line text-ink hover:border-blue"}`}
            >
              {p.cta}
            </a>
          </div>
        ))}
      </section>

      <section className="mt-11 border-y border-line bg-white px-6 py-8 md:px-10">
        <h2 className="text-center text-lg font-extrabold">ทุกแพ็กเกจได้ครบทุกความสามารถ</h2>
        <div className="mx-auto mt-4 grid max-w-4xl gap-x-7 gap-y-2.5 text-sm text-muted sm:grid-cols-2 lg:grid-cols-4">
          {INCLUDED.map((item) => (
            <span key={item}>
              <span className="mr-2 font-extrabold text-green">✓</span>
              {item}
            </span>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-2xl px-6 py-10 md:px-10">
        <h2 className="text-center text-2xl font-extrabold">คำถามที่พบบ่อย</h2>
        <div className="mt-5 space-y-2.5">
          {FAQ.map((f) => (
            <div key={f.q} className="rounded-xl border border-line bg-white px-5 py-4">
              <h3 className="text-[15px] font-bold">{f.q}</h3>
              <p className="mt-0.5 text-sm text-muted">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
