import { GoogleLoginButton } from "./google-login-button";

/**
 * ช่องทาง login ทั้งหมดของระบบ = social เท่านั้น (CLAUDE.md §4)
 * Google ใช้งานได้จริงแล้ว (GIS) · Facebook/LINE รอตั้งค่า app — ปุ่ม disabled พร้อมป้าย
 */

const PENDING = [
  { key: "facebook", label: "Facebook", initial: "f", color: "#1877F2", small: false },
  { key: "line", label: "LINE", initial: "LINE", color: "#06C755", small: true },
] as const;

function ProviderIcon({ p, size = 22 }: { p: (typeof PENDING)[number]; size?: number }) {
  return (
    <span
      className="flex flex-none items-center justify-center rounded-full font-extrabold text-white"
      style={{ width: size, height: size, background: p.color, fontSize: p.small ? size * 0.36 : size * 0.55 }}
    >
      {p.initial}
    </span>
  );
}

/** แบบแถวยาว — หน้าเข้าสู่ระบบ */
export function SocialLoginRows({ mode = "login" }: { mode?: "login" | "register" }) {
  return (
    <div className="space-y-2.5">
      <GoogleLoginButton mode={mode} />
      {PENDING.map((p) => (
        <button
          key={p.key}
          type="button"
          disabled
          title="กำลังตั้งค่า — เร็วๆ นี้"
          className="flex w-full cursor-not-allowed items-center gap-3 rounded-lg border border-line bg-white px-4 py-2.5 text-sm font-bold opacity-60"
        >
          <ProviderIcon p={p} />
          {mode === "login" ? "เข้าสู่ระบบ" : "สมัคร"}ด้วย {p.label}
          <span className="ml-auto rounded-full bg-paper px-2 py-0.5 text-[10px] font-bold text-muted">เร็วๆ นี้</span>
        </button>
      ))}
    </div>
  );
}

/** แบบตาราง — หน้าสมัครสมาชิก (Google เต็มแถวบน + FB/LINE รอตั้งค่า) */
export function SocialLoginGrid({ mode = "register" }: { mode?: "login" | "register" }) {
  return (
    <div className="space-y-3">
      <GoogleLoginButton mode={mode} />
      <div className="grid grid-cols-2 gap-3">
        {PENDING.map((p) => (
          <button
            key={p.key}
            type="button"
            disabled
            title="กำลังตั้งค่า — เร็วๆ นี้"
            className="flex cursor-not-allowed flex-col items-center gap-2 rounded-xl border border-dashed border-line bg-white px-2 py-4 text-[13px] font-bold opacity-60"
          >
            <ProviderIcon p={p} size={32} />
            {p.label}
            <span className="text-[10px] font-bold text-muted">เร็วๆ นี้</span>
          </button>
        ))}
      </div>
    </div>
  );
}
