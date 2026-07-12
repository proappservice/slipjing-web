"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { session } from "@/lib/api";

/** คน login ค้างอยู่ไม่ควรเห็นหน้า login/register — เด้งเข้า dashboard เลย */
export function RedirectIfAuthed() {
  const router = useRouter();
  useEffect(() => {
    if (session.token()) router.replace("/dashboard");
  }, [router]);
  return null;
}
