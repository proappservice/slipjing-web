"use client";

import { useCallback, useEffect, useState } from "react";
import { DashboardShell } from "@/components/dashboard-shell";
import { api } from "@/lib/api";

interface WebhookEndpoint {
  id: string;
  url: string;
  events: string[];
  active: boolean;
  createdAt?: string;
}

const EVENTS = [
  { value: "verification.completed", label: "verification.completed — ผลการตรวจสลิป" },
  { value: "topup.completed", label: "topup.completed — เติมเครดิตสำเร็จ" },
];

export default function WebhooksPage() {
  const [endpoints, setEndpoints] = useState<WebhookEndpoint[] | null>(null);
  const [url, setUrl] = useState("");
  const [events, setEvents] = useState<string[]>(["verification.completed"]);
  const [secret, setSecret] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setEndpoints(await api<WebhookEndpoint[]>("/shops/webhooks", { shopScoped: true }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "โหลดข้อมูลไม่สำเร็จ");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function create() {
    setBusy(true);
    setError(null);
    setCopied(false);
    try {
      const created = await api<{ secret: string }>("/shops/webhooks", {
        method: "POST",
        shopScoped: true,
        body: { url: url.trim(), events },
      });
      setSecret(created.secret);
      setUrl("");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "เพิ่ม endpoint ไม่สำเร็จ");
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("ลบ endpoint นี้?")) return;
    try {
      await api(`/shops/webhooks/${id}`, { method: "DELETE", shopScoped: true });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "ลบไม่สำเร็จ");
    }
  }

  const urlValid = /^https?:\/\/.+/.test(url.trim());

  return (
    <DashboardShell active="webhooks">
      <h1 className="text-xl font-extrabold">การแจ้งเตือน (Webhooks)</h1>
      <p className="mt-0.5 text-sm text-muted">
        ระบบยิงผลการตรวจเข้าระบบหลังร้านของคุณ พร้อมลายเซ็น HMAC-SHA256 ใน header{" "}
        <code className="rounded bg-white px-1.5 py-0.5 font-mono text-xs">X-SlipJing-Signature</code>
      </p>

      {error && <p className="mt-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">{error}</p>}

      {secret && (
        <div className="mt-5 flex flex-wrap items-center gap-3 rounded-xl border border-amber-500 bg-amber-50 px-5 py-3.5 text-sm text-amber-900">
          <span>⚠️ Secret สำหรับตรวจลายเซ็น — แสดง<b>ครั้งเดียวเท่านั้น</b></span>
          <code className="rounded-md bg-white px-3 py-1.5 font-mono text-xs text-ink">{secret}</code>
          <button
            onClick={async () => {
              await navigator.clipboard.writeText(secret);
              setCopied(true);
            }}
            className="rounded-lg border border-amber-500 px-3 py-1 text-xs font-bold"
          >
            {copied ? "✓ คัดลอกแล้ว" : "คัดลอก"}
          </button>
          <button onClick={() => setSecret(null)} className="ml-auto text-xs font-bold underline">ปิด</button>
        </div>
      )}

      {/* รายการ endpoint */}
      <div className="mt-5 space-y-3">
        {endpoints === null ? (
          <p className="text-muted">กำลังโหลด…</p>
        ) : endpoints.length === 0 ? (
          <div className="rounded-xl border border-dashed border-line bg-white p-6 text-center text-sm text-muted">
            ยังไม่มี endpoint — เพิ่มด้านล่างเพื่อรับผลตรวจแบบ realtime
          </div>
        ) : (
          endpoints.map((e) => (
            <div key={e.id} className="flex flex-wrap items-center gap-3 rounded-xl border border-line bg-white p-5">
              <code className="font-mono text-sm font-bold">{e.url}</code>
              <span className="flex gap-1.5">
                {e.events.map((ev) => (
                  <span key={ev} className="rounded-full bg-blue/10 px-2.5 py-0.5 text-xs font-bold text-blue">{ev}</span>
                ))}
              </span>
              <button onClick={() => remove(e.id)} className="ml-auto rounded-lg bg-red-50 px-3 py-1.5 text-xs font-bold text-red-700 hover:bg-red-100">
                ลบ
              </button>
            </div>
          ))
        )}
      </div>

      {/* ฟอร์มเพิ่ม */}
      <div className="mt-6 max-w-xl rounded-2xl border border-line bg-white p-6">
        <h2 className="font-bold">+ เพิ่ม endpoint</h2>
        <div className="mt-4 space-y-3.5 text-sm">
          <label className="block">
            <span className="mb-1 block font-bold">URL *</span>
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://api.yourshop.co.th/hooks/slipjing"
              className="w-full rounded-lg border border-line px-3 py-2.5 font-mono text-xs outline-none focus:border-blue"
            />
          </label>
          <div>
            <span className="mb-1 block font-bold">Events</span>
            {EVENTS.map((ev) => (
              <label key={ev.value} className="flex items-center gap-2 py-1">
                <input
                  type="checkbox"
                  checked={events.includes(ev.value)}
                  onChange={(e) =>
                    setEvents((prev) => (e.target.checked ? [...prev, ev.value] : prev.filter((x) => x !== ev.value)))
                  }
                />
                <code className="text-xs">{ev.label}</code>
              </label>
            ))}
          </div>
          <button
            onClick={create}
            disabled={busy || !urlValid || events.length === 0}
            className="w-full rounded-lg bg-blue py-2.5 font-bold text-white disabled:opacity-50"
          >
            {busy ? "กำลังบันทึก…" : "เพิ่ม endpoint"}
          </button>
        </div>
      </div>
    </DashboardShell>
  );
}
