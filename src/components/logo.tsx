/**
 * โลโก้ SlipJing — "ริบบิ้นเครื่องหมายถูก" (concept D, FINAL — CLAUDE.md §3)
 * onDark: ใช้บนพื้น navy/มืด (แขนสั้น sky + แขนยาว white)
 */
export function LogoMark({ size = 24, onDark = false }: { size?: number; onDark?: boolean }) {
  const short = onDark ? "#6D9BE8" : "#2C5FBE";
  const long = onDark ? "#FFFFFF" : "#14213D";
  const fold = onDark ? "#3E5C94" : "#0D1830";
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <polygon points="8,34 20,22 32,34 32,52 20,40" fill={short} />
      <polygon points="32,52 32,34 50,16 62,16 62,22" fill={long} />
      <polygon points="32,34 32,52 26,46" fill={fold} opacity={onDark ? 0.8 : 0.55} />
    </svg>
  );
}

/** โลโก้ + wordmark "SlipJing" (Slip navy + Jing blue — ติดกัน ไม่มีช่องว่าง) */
export function Logo({ size = 26, onDark = false }: { size?: number; onDark?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2 font-extrabold tracking-tight" style={{ fontSize: size * 0.8 }}>
      <LogoMark size={size} onDark={onDark} />
      <span>
        <span className={onDark ? "text-white" : "text-navy"}>Slip</span>
        <span className={onDark ? "text-sky" : "text-blue"}>Jing</span>
      </span>
    </span>
  );
}
