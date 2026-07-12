import Link from "next/link";
import { Logo } from "./logo";

export function SiteHeader({ active }: { active?: "pricing" | "docs" }) {
  return (
    <header className="flex items-center gap-6 border-b border-line bg-white px-6 py-4 md:px-10">
      <Link href="/" aria-label="กลับหน้าแรก SlipJing">
        <Logo size={28} />
      </Link>
      <nav className="ml-auto flex items-center gap-6 text-sm text-muted">
        <a href="#" className="hover:text-ink">เอกสาร API</a>
        <Link href="/pricing" className={active === "pricing" ? "font-bold text-blue" : "hover:text-ink"}>
          ราคา
        </Link>
        <Link href="/login" className="hover:text-ink">เข้าสู่ระบบ</Link>
        <Link href="/register" className="rounded-lg bg-blue px-4 py-2 text-sm font-bold text-white hover:opacity-90">
          สมัครฟรี 20 เครดิต
        </Link>
      </nav>
    </header>
  );
}
