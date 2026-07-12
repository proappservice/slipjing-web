import { HeroPhone } from "@/components/hero-phone";
import { Logo, LogoMark } from "@/components/logo";

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

const HOW_IT_WORKS = [
  { pic: "slip", title: "1. ส่งสลิปเข้ามา", desc: "ส่งรูปสลิปหรือข้อความ mini-QR ผ่าน API — ระบบถอดรหัสให้เอง" },
  { pic: "engine", title: "2. ตรวจกับธนาคารต้นทาง", desc: "ยืนยันรายการโอนจริง เช็กยอดเงิน และเช็กว่าสลิปเคยถูกใช้แล้วหรือไม่" },
  { pic: "check", title: "3. รับผลทันที", desc: "ตอบกลับใน ~1 วินาที พร้อมยิง webhook เข้าระบบหลังร้านของคุณ" },
] as const;

const CODE_SAMPLE = `POST /v1/verify
Authorization: Bearer sj_live_••••••••
Idempotency-Key: ord-10294

{ "payload": "00460006000112…",
  "expected_amount": 1500.00 }

→ 200 OK
{ "status": "verified",
  "checks": { "amount_match": true } }`;

function StepPictogram({ pic }: { pic: (typeof HOW_IT_WORKS)[number]["pic"] }) {
  if (pic === "slip") {
    return (
      <span className="relative block h-[60px] w-[46px] rounded-md border-[2.5px] border-navy bg-white">
        <span
          className="absolute left-[7px] right-[7px] top-[9px] h-[22px]"
          style={{ background: "repeating-linear-gradient(to bottom, var(--line) 0 3px, transparent 3px 9px)" }}
        />
        <span
          className="absolute bottom-[7px] left-[7px] h-[15px] w-[15px] border-[2.5px] border-blue"
          style={{ background: "linear-gradient(var(--blue), var(--blue)) 50% 50% / 5px 5px no-repeat" }}
        />
      </span>
    );
  }
  if (pic === "engine") {
    return (
      <span className="relative flex h-[58px] w-[58px] items-center justify-center rounded-full bg-navy">
        <span className="absolute -inset-[9px] rounded-full border-2 border-dashed border-blue/60" />
        <LogoMark size={32} onDark />
      </span>
    );
  }
  return (
    <span className="flex h-[58px] w-[58px] items-center justify-center rounded-full bg-green text-3xl font-extrabold text-white ring-[9px] ring-green/15">
      ✓
    </span>
  );
}

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

      {/* hero + background banner (แสงเรือง, ลายจุด, วงแหวน, เส้นโค้งท้าย — ตาม mockup) */}
      <section
        className="relative overflow-hidden px-6 pb-28 pt-16 text-white md:px-10 md:pt-20"
        style={{
          background: `radial-gradient(640px 340px at 76% 24%, rgba(104,152,235,.38), transparent 65%),
            radial-gradient(560px 320px at 4% 96%, rgba(64,116,205,.32), transparent 62%),
            linear-gradient(160deg, #14213D 0%, #1D3B72 70%, #23509B 100%)`,
        }}
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(rgba(255,255,255,.07) 1px, transparent 1.6px) -4px -4px / 26px 26px" }}
        />
        <div
          className="pointer-events-none absolute -right-32 -top-44 h-[520px] w-[520px] rounded-full border border-white/10"
          style={{ boxShadow: "0 0 0 80px rgba(255,255,255,.045), 0 0 0 180px rgba(255,255,255,.025)" }}
        />

        <div className="relative z-[1] mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-2">
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
          <HeroPhone />
        </div>

        {/* เส้นโค้งคั่นท้าย banner */}
        <div className="absolute -bottom-10 left-[-6%] z-[1] h-[92px] w-[112%] rounded-t-[50%] bg-paper" />
      </section>

      {/* แถบร้านค้า — TODO: เปลี่ยนเป็นโลโก้ลูกค้าจริงก่อน launch */}
      <section className="px-6 pt-7 text-center md:px-10">
        <p className="text-[11px] font-bold uppercase tracking-widest text-muted">ร้านค้าที่ไว้วางใจ (ตัวอย่าง)</p>
        <div className="mt-3.5 flex flex-wrap items-baseline justify-center gap-x-9 gap-y-3 text-[#8B95AC]">
          <span className="text-base font-extrabold">POMTECH</span>
          <span className="font-serif text-base font-bold italic">เจ๊หมวย Bakery</span>
          <span className="font-mono text-sm font-extrabold tracking-wider">88MOBILE</span>
          <span className="text-base font-extrabold">ShopChamp ✦</span>
          <span className="font-serif text-base font-bold italic">บ้านขนมไทย</span>
        </div>
      </section>

      {/* ทำงานอย่างไร */}
      <section className="mx-auto max-w-4xl px-6 pb-2 pt-12 md:px-10">
        <h2 className="text-center text-2xl font-extrabold">ทำงานอย่างไร</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {HOW_IT_WORKS.map((s, i) => (
            <div key={s.title} className="relative rounded-xl border border-line bg-white p-6 text-center">
              {i > 0 && (
                <span className="absolute -left-4 top-1/2 hidden -translate-y-1/2 text-lg text-muted sm:block">→</span>
              )}
              <div className="mb-3 flex h-[74px] items-center justify-center">
                <StepPictogram pic={s.pic} />
              </div>
              <h3 className="text-[15px] font-bold">{s.title}</h3>
              <p className="mt-1 text-[13px] text-muted">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* features */}
      <section className="mx-auto grid max-w-6xl gap-4 px-6 py-12 sm:grid-cols-2 lg:grid-cols-4 md:px-10">
        {FEATURES.map((f) => (
          <article key={f.title} className="rounded-xl border border-line bg-white p-6">
            <h3 className="font-bold">{f.icon} {f.title}</h3>
            <p className="mt-1.5 text-sm text-muted">{f.desc}</p>
          </article>
        ))}
      </section>

      {/* สร้างมาเพื่อนักพัฒนา */}
      <section className="border-y border-line bg-white px-6 py-12 md:px-10">
        <div className="mx-auto grid max-w-5xl items-center gap-9 md:grid-cols-[1fr_1.15fr]">
          <div>
            <h2 className="text-2xl font-extrabold">สร้างมาเพื่อนักพัฒนา</h2>
            <ul className="mt-4 space-y-2.5 text-sm text-muted">
              {[
                "REST API เดียว รองรับทั้งข้อความ QR และรูปสลิป",
                "Idempotency-Key กันยิงซ้ำ — ไม่มีการหักเครดิตสองครั้ง",
                "ตรวจยอดเงิน/บัญชีผู้รับที่คาดหวังได้ในคำขอเดียว",
                "error code อ่านได้ด้วยเครื่อง พร้อมเอกสารภาษาไทย",
              ].map((li) => (
                <li key={li}>
                  <span className="mr-2 font-extrabold text-green">✓</span>
                  {li}
                </li>
              ))}
            </ul>
          </div>
          <pre className="overflow-x-auto rounded-xl border border-[#2B3D61] bg-[#0D1526] p-5 text-xs leading-relaxed text-[#C7D5EE]">
            {CODE_SAMPLE}
          </pre>
        </div>
      </section>

      {/* pricing */}
      <section id="pricing" className="px-6 py-14 md:px-10">
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
