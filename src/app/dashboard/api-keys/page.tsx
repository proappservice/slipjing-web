"use client";

import { useCallback, useEffect, useState } from "react";
import { DashboardShell } from "@/components/dashboard-shell";
import { api } from "@/lib/api";

interface ApiKeyRow {
  id: string;
  name: string;
  keyPrefix: string;
  lastUsedAt: string | null;
  revokedAt: string | null;
  createdAt: string;
}

interface NewKeyResponse {
  id: string;
  key: string;
  key_prefix: string;
}

const fmtDate = (iso: string | null) =>
  iso ? new Date(iso).toLocaleString("th-TH", { day: "numeric", month: "short", year: "2-digit", hour: "2-digit", minute: "2-digit" }) : "—";

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<ApiKeyRow[] | null>(null);
  const [newKey, setNewKey] = useState<NewKeyResponse | null>(null);
  const [name, setName] = useState("");
  const [mode, setMode] = useState<"live" | "test">("live");
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setKeys(await api<ApiKeyRow[]>("/shops/api-keys", { shopScoped: true }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "โหลดข้อมูลไม่สำเร็จ");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function run(action: () => Promise<NewKeyResponse | void>) {
    setBusy(true);
    setError(null);
    setCopied(false);
    try {
      const result = await action();
      if (result) setNewKey(result);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "ดำเนินการไม่สำเร็จ");
    } finally {
      setBusy(false);
    }
  }

  const create = () =>
    run(async () => {
      const created = await api<NewKeyResponse>("/shops/api-keys", {
        method: "POST",
        shopScoped: true,
        body: { name: name.trim() || "API key", mode },
      });
      setName("");
      return created;
    });

  const rotate = (id: string) =>
    confirm("Rotate จะเพิกถอน key เดิมทันที ระบบที่ใช้ key เก่าจะยิงไม่ผ่าน — ยืนยัน?")
      ? run(() => api<NewKeyResponse>(`/shops/api-keys/${id}/rotate`, { method: "POST", shopScoped: true }))
      : undefined;

  const revoke = (id: string) =>
    confirm("เพิกถอน key นี้ถาวร?")
      ? run(async () => {
          await api(`/shops/api-keys/${id}`, { method: "DELETE", shopScoped: true });
        })
      : undefined;

  async function copyKey() {
    if (!newKey) return;
    await navigator.clipboard.writeText(newKey.key);
    setCopied(true);
  }

  return (
    <DashboardShell active="api-keys">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-xl font-extrabold">API Keys</h1>
        <div className="ml-auto flex gap-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="ชื่อ key เช่น Production"
            className="rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-blue"
          />
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value as "live" | "test")}
            className="rounded-lg border border-line bg-white px-2 py-2 text-sm outline-none"
          >
            <option value="live">live</option>
            <option value="test">test</option>
          </select>
          <button onClick={create} disabled={busy} className="rounded-lg bg-blue px-4 py-2 text-sm font-bold text-white disabled:opacity-50">
            + สร้าง key
          </button>
        </div>
      </div>

      {error && <p className="mt-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">{error}</p>}

      {/* key เต็มแสดงครั้งเดียว (CLAUDE.md §6 / สเปก backend §4) */}
      {newKey && (
        <div className="mt-5 flex flex-wrap items-center gap-3 rounded-xl border border-amber-500 bg-amber-50 px-5 py-3.5 text-sm text-amber-900">
          <span>⚠️ คัดลอก key นี้เก็บไว้ตอนนี้ — ระบบจะแสดงให้เห็น<b>ครั้งเดียวเท่านั้น</b></span>
          <code className="rounded-md bg-white px-3 py-1.5 font-mono text-xs text-ink">{newKey.key}</code>
          <button onClick={copyKey} className="rounded-lg border border-amber-500 px-3 py-1 text-xs font-bold">
            {copied ? "✓ คัดลอกแล้ว" : "คัดลอก"}
          </button>
          <button onClick={() => setNewKey(null)} className="ml-auto text-xs font-bold underline">ปิด</button>
        </div>
      )}

      <div className="mt-5 overflow-x-auto rounded-xl border border-line bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-muted">
              <th className="px-4 py-3">ชื่อ</th>
              <th className="px-4 py-3">Key</th>
              <th className="px-4 py-3">ใช้ล่าสุด</th>
              <th className="px-4 py-3">สร้างเมื่อ</th>
              <th className="px-4 py-3">สถานะ</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {keys === null ? (
              <tr><td colSpan={6} className="px-4 py-6 text-center text-muted">กำลังโหลด…</td></tr>
            ) : keys.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-6 text-center text-muted">ยังไม่มี key — สร้าง key แรกเพื่อเริ่มยิง API</td></tr>
            ) : (
              keys.map((k) => (
                <tr key={k.id} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-bold">{k.name}</td>
                  <td className="px-4 py-3 font-mono text-xs">{k.keyPrefix}••••</td>
                  <td className="px-4 py-3 tabular-nums">{fmtDate(k.lastUsedAt)}</td>
                  <td className="px-4 py-3 tabular-nums">{fmtDate(k.createdAt)}</td>
                  <td className="px-4 py-3">
                    {k.revokedAt ? (
                      <span className="rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-bold text-red-700">เพิกถอนแล้ว</span>
                    ) : (
                      <span className="rounded-full bg-green/10 px-2.5 py-0.5 text-xs font-bold text-green">ใช้งานอยู่</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {!k.revokedAt && (
                      <span className="flex justify-end gap-2">
                        <button onClick={() => rotate(k.id)} className="rounded-lg border border-line px-3 py-1 text-xs font-bold hover:border-blue">
                          Rotate
                        </button>
                        <button onClick={() => revoke(k.id)} className="rounded-lg bg-red-50 px-3 py-1 text-xs font-bold text-red-700 hover:bg-red-100">
                          เพิกถอน
                        </button>
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-xs text-muted">
        ระบบเก็บเฉพาะ SHA-256 hash ของ key — แสดงได้แค่ 8 ตัวแรก · ใช้ยิง API:{" "}
        <code className="rounded bg-white px-1.5 py-0.5 font-mono">Authorization: Bearer sj_live_…</code>
      </p>
    </DashboardShell>
  );
}
