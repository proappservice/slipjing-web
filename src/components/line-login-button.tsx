"use client";

const LINE_CHANNEL_ID = process.env.NEXT_PUBLIC_LINE_CHANNEL_ID;
const LINE_GREEN = "#06C755";

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

  if (variant === "tile") {
    return (
      <button
        type="button"
        onClick={configured ? startLineLogin : undefined}
        disabled={!configured}
        title={configured ? undefined : "ยังไม่ได้ตั้งค่า NEXT_PUBLIC_LINE_CHANNEL_ID"}
        className={`flex flex-col items-center gap-2 rounded-xl border bg-white px-2 py-4 text-[13px] font-bold shadow-sm ${
          configured ? "border-line hover:border-blue" : "cursor-not-allowed border-dashed border-line opacity-60"
        }`}
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-extrabold text-white" style={{ background: LINE_GREEN }}>
          LINE
        </span>
        LINE
        {!configured && <span className="text-[10px] font-bold text-muted">เร็วๆ นี้</span>}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={configured ? startLineLogin : undefined}
      disabled={!configured}
      title={configured ? undefined : "ยังไม่ได้ตั้งค่า NEXT_PUBLIC_LINE_CHANNEL_ID"}
      className={`flex w-full items-center gap-3 rounded-lg border bg-white px-4 py-2.5 text-sm font-bold ${
        configured ? "border-line hover:border-blue" : "cursor-not-allowed border-line opacity-60"
      }`}
    >
      <span className="flex h-[22px] w-[22px] flex-none items-center justify-center rounded-full text-[8px] font-extrabold text-white" style={{ background: LINE_GREEN }}>
        LINE
      </span>
      {mode === "login" ? "เข้าสู่ระบบ" : "สมัคร"}ด้วย LINE
      {!configured && <span className="ml-auto rounded-full bg-paper px-2 py-0.5 text-[10px] font-bold text-muted">เร็วๆ นี้</span>}
    </button>
  );
}
