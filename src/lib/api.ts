/** API client บางๆ สำหรับ slipjing-core-api — จัดการ error envelope {error:{code,message}} ให้ */

export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

export class ApiError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly status: number,
  ) {
    super(message);
  }
}

const TOKEN_KEY = "sj_token";
const SHOP_KEY = "sj_shop_id";

export const session = {
  token: () => (typeof window === "undefined" ? null : localStorage.getItem(TOKEN_KEY)),
  shopId: () => (typeof window === "undefined" ? null : localStorage.getItem(SHOP_KEY)),
  save: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  selectShop: (shopId: string) => localStorage.setItem(SHOP_KEY, shopId),
  clear: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(SHOP_KEY);
  },
};

export async function api<T>(
  path: string,
  opts: { method?: string; body?: unknown; shopScoped?: boolean } = {},
): Promise<T> {
  const headers: Record<string, string> = { "content-type": "application/json" };
  const token = session.token();
  if (token) headers.authorization = `Bearer ${token}`;
  if (opts.shopScoped) {
    const shopId = session.shopId();
    if (shopId) headers["x-shop-id"] = shopId;
  }

  const res = await fetch(`${API_URL}${path}`, {
    method: opts.method ?? "GET",
    headers,
    body: opts.body === undefined ? undefined : JSON.stringify(opts.body),
  });

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const err = (data as { error?: { code?: string; message?: string } } | null)?.error;
    throw new ApiError(err?.code ?? "internal_error", err?.message ?? `HTTP ${res.status}`, res.status);
  }
  return data as T;
}
