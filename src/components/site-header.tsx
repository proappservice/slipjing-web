import Link from "next/link";
import { AuthNav } from "./auth-nav";
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
        <AuthNav />
      </nav>
    </header>
  );
}
