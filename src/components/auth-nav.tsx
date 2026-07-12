"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { session } from "@/lib/api";

/**
 * ปุ่ม auth มุมขวาของ header หน้าเว็บ — รู้สถานะ login (เช็คหลัง mount
 * เพื่อไม่ให้ HTML ฝั่ง server ไม่ตรงกับ client)
 */
export function AuthNav() {
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    setLoggedIn(Boolean(session.token()));
  }, []);

  if (loggedIn) {
    return (
      <Link href="/dashboard" className="rounded-lg bg-blue px-4 py-2 text-sm font-bold text-white hover:opacity-90">
        เข้า Dashboard →
      </Link>
    );
  }

  return (
    <>
      <Link href="/login" className="hover:text-ink">เข้าสู่ระบบ</Link>
      <Link href="/register" className="rounded-lg bg-blue px-4 py-2 text-sm font-bold text-white hover:opacity-90">
        สมัครฟรี 20 เครดิต
      </Link>
    </>
  );
}
