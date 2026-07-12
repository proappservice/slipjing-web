/**
 * ปุ่ม social login (Google / Facebook / LINE — ช่องทางเดียวของระบบ, CLAUDE.md §4)
 * TODO: ต่อ OAuth flow จริงเมื่อตั้งค่า client id ของแต่ละ provider แล้ว
 * (ได้ credential แล้วยิง POST /auth/social ของ backend)
 */

const PROVIDERS = [
  { key: "google", label: "Google", initial: "G", color: "#4285F4", small: false },
  { key: "facebook", label: "Facebook", initial: "f", color: "#1877F2", small: false },
  { key: "line", label: "LINE", initial: "LINE", color: "#06C755", small: true },
] as const;

function ProviderIcon({ p, size = 22 }: { p: (typeof PROVIDERS)[number]; size?: number }) {
  return (
    <span
      className="flex flex-none items-center justify-center rounded-full font-extrabold text-white"
      style={{ width: size, height: size, background: p.color, fontSize: p.small ? size * 0.36 : size * 0.55 }}
    >
      {p.initial}
    </span>
  );
}

/** แบบแถวยาว — ใช้ในหน้าเข้าสู่ระบบ */
export function SocialLoginRows() {
  return (
    <div className="space-y-2.5">
      {PROVIDERS.map((p) => (
        <button
          key={p.key}
          type="button"
          className="flex w-full items-center gap-3 rounded-lg border border-line bg-white px-4 py-2.5 text-sm font-bold hover:border-blue"
        >
          <ProviderIcon p={p} />
          เข้าสู่ระบบด้วย {p.label}
        </button>
      ))}
    </div>
  );
}

/** แบบตาราง 3 ช่อง — ใช้ในหน้าสมัครสมาชิก (โครงเดียวกับ slip2go) */
export function SocialLoginGrid() {
  return (
    <div className="grid grid-cols-3 gap-3">
      {PROVIDERS.map((p) => (
        <button
          key={p.key}
          type="button"
          className="flex flex-col items-center gap-2 rounded-xl border border-line bg-white px-2 py-4 text-[13px] font-bold shadow-sm hover:border-blue"
        >
          <ProviderIcon p={p} size={32} />
          {p.label}
        </button>
      ))}
    </div>
  );
}
