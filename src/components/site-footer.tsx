export function SiteFooter() {
  return (
    <footer className="mt-auto flex flex-wrap gap-x-6 gap-y-2 border-t border-line bg-white px-6 py-5 text-xs text-muted md:px-10">
      <span>© 2026 SlipJing</span>
      {/* TODO: หน้า ToS + Privacy เป็นข้อบังคับ Phase 1 (PDPA) — รอเนื้อหาจากเจ้าของ */}
      <a href="#" className="hover:text-ink">เงื่อนไขการใช้บริการ</a>
      <a href="#" className="hover:text-ink">นโยบายความเป็นส่วนตัว (PDPA)</a>
      <span>ติดต่อ: support@slipjing.com</span>
    </footer>
  );
}
