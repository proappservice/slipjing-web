/**
 * ลาย QR ประกอบ (deterministic — ปลอดภัยต่อ SSR/hydration, ไม่ใช่ QR จริง)
 * โครงเดียวกับใน mockup: finder pattern 3 มุม + โมดูลสุ่มจาก seeded LCG
 */
export function QrPattern({ seed = 42, className = "" }: { seed?: number; className?: string }) {
  const N = 21;
  let s = seed;
  const rnd = () => (s = (s * 1103515245 + 12345) % 2147483648) / 2147483648;

  const inFinder = (r: number, c: number) => (r < 7 && c < 7) || (r < 7 && c >= N - 7) || (r >= N - 7 && c < 7);
  const finderDark = (r: number, c: number) => {
    const rr = r >= N - 7 ? r - (N - 7) : r;
    const cc = c >= N - 7 ? c - (N - 7) : c;
    return rr === 0 || rr === 6 || cc === 0 || cc === 6 || (rr >= 2 && rr <= 4 && cc >= 2 && cc <= 4);
  };

  const cells: boolean[] = [];
  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      cells.push(inFinder(r, c) ? finderDark(r, c) : rnd() > 0.52);
    }
  }

  return (
    <span
      className={`grid bg-white ${className}`}
      style={{ gridTemplateColumns: `repeat(${N}, 1fr)`, gridAutoRows: "1fr", gap: 1 }}
      aria-hidden="true"
    >
      {cells.map((dark, i) => (
        <span key={i} className={dark ? "rounded-[1px] bg-navy" : ""} />
      ))}
    </span>
  );
}
