import { FacebookIcon } from "./brand-icons";
import { GoogleLoginButton } from "./google-login-button";
import { LineLoginButton } from "./line-login-button";

/**
 * ช่องทาง login ทั้งหมดของระบบ = social เท่านั้น (CLAUDE.md §4)
 * Google + LINE ใช้งานได้จริง · Facebook รอตั้งค่า app — disabled พร้อมป้าย
 */

/** แบบแถวยาว — หน้าเข้าสู่ระบบ */
export function SocialLoginRows({ mode = "login" }: { mode?: "login" | "register" }) {
  return (
    <div className="space-y-2.5">
      <GoogleLoginButton mode={mode} />
      <LineLoginButton mode={mode} />
      <button
        type="button"
        disabled
        title="กำลังตั้งค่า — เร็วๆ นี้"
        className="relative flex w-full cursor-not-allowed items-center justify-center rounded-lg border border-line bg-white px-4 py-2.5 text-sm font-bold opacity-60 hover:bg-blue/10"
      >
        <span className="absolute left-3">
          <FacebookIcon size={20} />
        </span>
        {mode === "login" ? "เข้าสู่ระบบ" : "สมัคร"}ด้วย Facebook
        <span className="absolute right-3 rounded-full bg-paper px-2 py-0.5 text-[10px] font-bold text-muted">เร็วๆ นี้</span>
      </button>
    </div>
  );
}

