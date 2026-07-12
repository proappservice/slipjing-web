import { Logo } from "@/components/logo";

const FEATURES = [
  { icon: "🛡️", title: "จับสลิปซ้ำอัตโนมัติ", desc: "สลิปใบเดิมถูกส่งซ้ำเมื่อไหร่ ระบบตอบ duplicate_slip พร้อมอ้างอิงการตรวจครั้งแรกทันที" },
  { icon: "⚡", title: "API เดียว ทุกธนาคาร", desc: "ส่งข้อความ QR หรืออัปโหลดรูปสลิปก็ได้ ระบบถอดรหัส mini-QR และตรวจกับธนาคารต้นทางให้เอง" },
  { icon: "💰", title: "จ่ายเท่าที่ใช้จริง", desc: "เติมเครดิตล่วงหน้า ไม่มีรายเดือน หักเครดิตเฉพาะเมื่อตรวจสำเร็จ — ระบบล่มไม่คิดเงิน" },
  { icon: "🔔", title: "Webhook แจ้งผลทันที", desc: "รับ event ผลการตรวจพร้อมลายเซ็น HMAC ปลอมแปลงไม่ได้ ต่อเข้าระบบหลังบ้านของร้านได้เลย" },
];

const PACKAGES = [
  { name: "เริ่มต้น", price: "฿150", credits: "100 เครดิต", per: "฿1.50/ครั้ง", hot: false },
  { name: "ร้านค้า", price: "฿600", credits: "500 เครดิต", per: "฿1.20/ครั้ง", hot: true },
  { name: "ธุรกิจ", price: "฿2,000", credits: "2,000 เครดิต", per: "฿1.00/ครั้ง", hot: false },
];

export default function LandingPage() {
  return (
    <main>
      {/* navbar */}
      <header className="flex items-center gap-6 border-b border-line bg-white px-6 py-4 md:px-10">
        <Logo size={28} />
        <nav className="ml-auto flex items-center gap-6 text-sm text-muted">
          <a href="#" className="hover:text-ink">เอกสาร API</a>
          <a href="#pricing" className="hover:text-ink">ราคา</a>
          <a href="#" className="hover:text-ink">เข้าสู่ระบบ</a>
          <a href="#" className="rounded-lg bg-blue px-4 py-2 text-sm font-bold text-white hover:opacity-90">
            สมัครฟรี 20 เครดิต
          </a>
        </nav>
      </header>

      {/* hero */}
      <section className="bg-gradient-to-br from-navy via-[#1D3B72] to-[#23509B] px-6 py-16 text-white md:px-10 md:py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-2">
          <div>
            <h1 className="text-3xl font-extrabold leading-snug text-balance md:text-4xl">
              ตรวจสลิปโอนเงินว่า &ldquo;จริงหรือปลอม&rdquo; ก่อนส่งของทุกครั้ง
            </h1>
            <p className="mt-4 max-w-lg text-[#B9C7E2]">
              API เดียวตรวจสลิปธนาคารไทยได้ทุกธนาคาร พร้อมจับสลิปซ้ำอัตโนมัติ —
              รูปแบบโกงอันดับหนึ่งของร้านค้าออนไลน์ เริ่มใช้ได้ในไม่กี่นาที
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href="#" className="rounded-lg bg-white px-5 py-2.5 font-bold text-navy hover:opacity-90">
                เริ่มใช้ฟรี — ไม่ต้องผูกบัตร
              </a>
              <a href="#" className="rounded-lg border border-[#5F7CB4] px-5 py-2.5 font-bold text-[#DCE6F7] hover:bg-white/10">
                อ่านเอกสาร API
              </a>
            </div>
          </div>
          <pre className="overflow-x-auto rounded-xl border border-[#2B3D61] bg-[#0D1526] p-5 text-xs leading-relaxed text-[#C7D5EE]">
{`POST /v1/verify
Authorization: Bearer sj_live_••••••••
Idempotency-Key: ord-10294

{ "payload": "00460006000112…",
  "expected_amount": 1500.00 }

→ 200 OK
{ "status": "verified",
  "checks": { "amount_match": true } }`}
          </pre>
        </div>
      </section>

      {/* features */}
      <section className="mx-auto grid max-w-6xl gap-4 px-6 py-14 sm:grid-cols-2 lg:grid-cols-4 md:px-10">
        {FEATURES.map((f) => (
          <article key={f.title} className="rounded-xl border border-line bg-white p-6">
            <h3 className="font-bold">{f.icon} {f.title}</h3>
            <p className="mt-1.5 text-sm text-muted">{f.desc}</p>
          </article>
        ))}
      </section>

      {/* pricing */}
      <section id="pricing" className="px-6 pb-16 md:px-10">
        <h2 className="text-center text-2xl font-extrabold">แพ็กเกจเครดิต</h2>
        <p className="mt-1 text-center text-sm text-muted">
          1 เครดิต = ตรวจสลิป 1 ครั้ง · เติมผ่าน PromptPay · เครดิตไม่มีวันหมดอายุ (ราคาตัวอย่าง)
        </p>
        <div className="mx-auto mt-8 grid max-w-4xl gap-4 sm:grid-cols-3">
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
              <h3 className="font-bold">{p.name}</h3>
              <p className="mt-1 text-3xl font-extrabold text-navy">{p.price}</p>
              <p className="text-sm text-muted">{p.credits} · {p.per}</p>
              <a
                href="#"
                className={`mt-4 inline-block rounded-lg px-4 py-1.5 text-sm font-bold ${p.hot ? "bg-blue text-white" : "border border-line text-ink"}`}
              >
                เลือกแพ็กเกจ
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* footer */}
      <footer className="flex flex-wrap gap-x-6 gap-y-2 border-t border-line bg-white px-6 py-5 text-xs text-muted md:px-10">
        <span>© 2026 SlipJing</span>
        <a href="#" className="hover:text-ink">เงื่อนไขการใช้บริการ</a>
        <a href="#" className="hover:text-ink">นโยบายความเป็นส่วนตัว (PDPA)</a>
        <span>ติดต่อ: support@slipjing.com</span>
      </footer>
    </main>
  );
}
