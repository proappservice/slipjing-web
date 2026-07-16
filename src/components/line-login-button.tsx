"use client";

import Image from "next/image";

/** โลโก้แอป LINE ทางการ (PNG 240px จากไฟล์ต้นฉบับ — แสดงย่อจึงคมระดับ retina) */
function LineAppIcon({ size = 30 }: { size?: number }) {
  return <Image src="/icons/line.png" width={size} height={size} alt="" className="rounded-md" />;
}

const LINE_CHANNEL_ID = process.env.NEXT_PUBLIC_LINE_CHANNEL_ID;

/** เริ่ม LINE Login v2.1: จำ state กันฟิชชิ่ง แล้ว redirect ไปหน้า authorize ของ LINE */
export function startLineLogin() {
  const state = crypto.randomUUID();
  sessionStorage.setItem("line_login_state", state);
  const params = new URLSearchParams({
    response_type: "code",
    client_id: LINE_CHANNEL_ID ?? "",
    redirect_uri: `${window.location.origin}/auth/line/callback`,
    state,
    scope: "profile openid email",
  });
  window.location.href = `https://access.line.me/oauth2/v2.1/authorize?${params}`;
}

/* พื้นขาวเหมือนปุ่ม Google/Facebook + ไอคอนแอป LINE ทางการที่คมชัด */
export function LineLoginButton({ mode = "login" }: { mode?: "login" | "register" }) {
  const configured = Boolean(LINE_CHANNEL_ID);

  return (
    <button
      type="button"
      onClick={configured ? startLineLogin : undefined}
      disabled={!configured}
      title={configured ? undefined : "ยังไม่ได้ตั้งค่า NEXT_PUBLIC_LINE_CHANNEL_ID"}
      className={`relative flex w-full items-center justify-center rounded-lg border bg-white px-4 py-2.5 text-sm ${
        configured ? "border-line hover:border-blue" : "cursor-not-allowed border-line opacity-60"
      }`}
    >
      <span className="absolute left-3">
        <LineAppIcon size={25} />
      </span>
      {mode === "login" ? "เข้าสู่ระบบ" : "สมัคร"}ด้วย LINE
      {!configured && (
        <span className="absolute right-3 rounded-full bg-paper px-2 py-0.5 text-[10px] font-bold text-muted">เร็วๆ นี้</span>
      )}
    </button>
  );
}
