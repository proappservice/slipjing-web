import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { SocialLoginRows } from "@/components/social-login";

export const metadata: Metadata = {
  title: "เข้าสู่ระบบ — SlipJing",
  description: "เข้าสู่ระบบ SlipJing ด้วย Google, Facebook หรือ LINE",
};

export default function LoginPage() {
  return (
    <main
      className="grid min-h-screen place-items-center px-5 py-10"
      style={{ background: "radial-gradient(700px 380px at 50% -80px, #E7EEFA, var(--paper))" }}
    >
      <div className="w-full max-w-[400px] rounded-2xl border border-line bg-white p-8 shadow-[0_10px_30px_rgba(10,20,40,.07)]">
        <div className="flex justify-center">
          <Link href="/" aria-label="กลับหน้าแรก SlipJing">
            <Logo size={30} />
          </Link>
        </div>
        <h1 className="mt-3 text-center text-lg font-bold">เข้าสู่ระบบ</h1>
        <p className="mb-6 mt-0.5 text-center text-[13px] text-muted">
          เลือกช่องทางที่เคยสมัครไว้ — ไม่ต้องใช้รหัสผ่าน
        </p>

        <SocialLoginRows />

        <div className="my-5 flex items-center gap-3 text-xs text-muted">
          <span className="h-px flex-1 bg-line" />
          หรือ
          <span className="h-px flex-1 bg-line" />
        </div>

        <Link
          href="/register"
          className="block rounded-lg border border-line py-2.5 text-center text-sm font-bold hover:border-blue"
        >
          สมัครสมาชิก
        </Link>
      </div>
    </main>
  );
}
