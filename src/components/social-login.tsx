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
      <LineLoginButton variant="row" mode={mode} />
      <button
        type="button"
        disabled
        title="กำลังตั้งค่า — เร็วๆ นี้"
        className="flex w-full cursor-not-allowed items-center justify-center gap-2.5 rounded-lg border border-line bg-white px-4 py-2.5 text-sm font-bold opacity-60"
      >
        <FacebookIcon size={20} />
        {mode === "login" ? "เข้าสู่ระบบ" : "สมัคร"}ด้วย Facebook
        <span className="ml-auto rounded-full bg-paper px-2 py-0.5 text-[10px] font-bold text-muted">เร็วๆ นี้</span>
      </button>
    </div>
  );
}

/** แบบตาราง — หน้าสมัครสมาชิก (Google เต็มแถวบน + LINE/FB เป็นช่อง) */
export function SocialLoginGrid({ mode = "register" }: { mode?: "login" | "register" }) {
  return (
    <div className="space-y-3">
      <GoogleLoginButton mode={mode} />
      <div className="grid grid-cols-2 gap-3">
        <LineLoginButton variant="tile" mode={mode} />
        <button
          type="button"
          disabled
          title="กำลังตั้งค่า — เร็วๆ นี้"
          className="flex cursor-not-allowed flex-col items-center gap-2.5 rounded-xl border border-dashed border-line bg-white px-2 py-4 text-[13px] font-bold opacity-60"
        >
          <FacebookIcon size={34} />
          Facebook
          <span className="text-[10px] font-bold text-muted">เร็วๆ นี้</span>
        </button>
      </div>
    </div>
  );
}
