"use client";

import { LineIcon } from "./brand-icons";

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

export function LineLoginButton({ variant, mode = "login" }: { variant: "row" | "tile"; mode?: "login" | "register" }) {
  const configured = Boolean(LINE_CHANNEL_ID);

  /* ปุ่มตามสเปกทางการของ LINE: พื้น #06C755 + ไอคอน/ตัวหนังสือขาว */
  if (variant === "tile") {
    return (
      <button
        type="button"
        onClick={configured ? startLineLogin : undefined}
        disabled={!configured}
        title={configured ? undefined : "ยังไม่ได้ตั้งค่า NEXT_PUBLIC_LINE_CHANNEL_ID"}
        className={`flex flex-col items-center gap-2 rounded-xl px-2 py-4 text-[13px] font-bold text-white shadow-sm ${
          configured ? "bg-[#06C755] hover:bg-[#05B34C]" : "cursor-not-allowed bg-[#06C755]/50"
        }`}
      >
        <LineIcon size={36} color="#FFFFFF" />
        LINE
        {!configured && <span className="text-[10px] font-bold">เร็วๆ นี้</span>}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={configured ? startLineLogin : undefined}
      disabled={!configured}
      title={configured ? undefined : "ยังไม่ได้ตั้งค่า NEXT_PUBLIC_LINE_CHANNEL_ID"}
      className={`relative flex w-full items-center justify-center rounded-lg px-4 py-2.5 text-sm font-bold text-white ${
        configured ? "bg-[#06C755] hover:bg-[#05B34C]" : "cursor-not-allowed bg-[#06C755]/50"
      }`}
    >
      <span className="absolute left-3.5">
        <LineIcon size={24} color="#FFFFFF" />
      </span>
      {mode === "login" ? "เข้าสู่ระบบ" : "สมัคร"}ด้วย LINE
      {!configured && (
        <span className="absolute right-3 rounded-full bg-white/25 px-2 py-0.5 text-[10px] font-bold">เร็วๆ นี้</span>
      )}
    </button>
  );
}
