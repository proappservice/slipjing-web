@AGENTS.md

# CLAUDE.md — slipjing-web: Frontend ของ SlipJing (slipjing.com)

> ไฟล์นี้คือความจำถาวรของโปรเจกต์ — สรุปทุกการตัดสินใจที่เจ้าของ (คุณป้อม pakpoom@proapps.co.th)
> เคาะไว้แล้ว ห้ามออกแบบสวนทางโดยไม่ถาม · **ตอบเจ้าของเป็นภาษาไทยเสมอ** (ศัพท์เทคนิคคงอังกฤษได้)

## 1. โปรเจกต์นี้คืออะไร

Frontend ทั้งหมดของ SlipJing — SaaS ตรวจสอบสลิปโอนเงินธนาคารไทย (คู่แข่ง/แรงบันดาลใจ: slip2go.com)
repo เดียวครอบ 3 ส่วน: **เว็บสาธารณะ** (landing, ราคา, ToS/PDPA — ต้องได้ SEO) ·
**Dashboard ร้านค้า** (หลัง login) · **Admin console** (path `/admin`, เจ้าของระบบใช้คนเดียว)

Backend อยู่คนละ repo: `../slipjing-core-api` (github.com/proappservice/slipjing-core-api) —
NestJS ตอบ JSON อย่างเดียว สเปกธุรกิจฉบับเต็มอยู่ที่ CLAUDE.md ของ repo นั้น อ่านได้เมื่อต้องการรายละเอียด API

## 2. Tech stack (เจ้าของเคาะแล้ว 12 ก.ค. 2026)

- **Next.js (App Router) + TypeScript + Tailwind CSS v4** — เลือกเพราะหน้า public ต้องได้ SEO เต็ม
  (สู้ slip2go ด้วย keyword "ตรวจสลิปปลอม/เช็คสลิป API") — เจ้าของเคยลังเลกับ Vite+React SPA
  แต่ตัดสินใจแล้ว อย่ารื้อ
- หน้า public = SSG · หน้า dashboard = client-side (อยู่หลัง login ไม่ต้อง SEO)
- Deploy เป้าหมาย: Cloud Run (แบบเดียวกับ backend) · โดเมน: slipjing.com / app.slipjing.com
- UI **ภาษาไทยทั้งหมด**

## 3. แบรนด์ (เจ้าของเลือกแล้ว — FINAL)

- **โลโก้: "ริบบิ้นเครื่องหมายถูก" (concept D)** — ไม่มีตัวอักษรในโลโก้ (เจ้าของ reject แบบ QR-frame
  และแบบ S+J ligature ไปแล้ว อย่าเสนอใหม่) · ดู `src/components/logo.tsx` — SVG polygons:
  แขนสั้น `8,34 20,22 32,34 32,52 20,40` (blue) · แขนยาว `32,52 32,34 50,16 62,16 62,22` (navy) ·
  เงารอยพับ `32,34 32,52 26,46` (#0D1830 @55%) · บนพื้นมืดใช้ sky+white
- **Wordmark**: "Slip" (navy) + "Jing" (blue) ติดกันไม่มีช่องว่าง น้ำหนัก 800
- **ชุดสี**: navy `#14213D` (หลัก) · blue `#2C5FBE` (accent) · sky `#6D9BE8` (accent บนพื้นมืด) ·
  green `#1E9E5A` (ผลตรวจผ่าน) · paper `#F5F7FA` (พื้น) — ประกาศเป็น token ใน `globals.css` แล้ว
- Mockup ที่ approve แล้วครบ 10 หน้าจอ (landing พร้อมภาพประกอบ+background banner, pricing,
  login/register แยกหน้า, dashboard 5 หน้า, admin): artifact
  https://claude.ai/code/artifact/561c2b01-0ecb-49a1-a8a8-8b7f25210933 — ใช้เป็น reference การ implement

## 4. กติกาธุรกิจที่ frontend ต้องรู้

- **Auth: social login เท่านั้น** (Google / Facebook / LINE) — ไม่มี email/password, ไม่มีเบอร์โทร
  (เอาออกจาก UI แล้ว จะกลับมาเมื่อระบบส่ง SMS ได้) · หน้า login กับ register แยกกันแบบ slip2go
- **Onboarding บังคับ**: login ครั้งแรก → สร้างร้านก่อน → เพิ่มบัญชีธนาคาร ≥1 → ใช้งานได้
- **ร้านค้า = tenant**: 1 ผู้ใช้มีหลายร้าน แต่ละร้านมีเครดิต/API key/บัญชีธนาคารแยกกัน →
  UI ต้องมีตัวสลับร้าน และทุก request ฝั่ง dashboard ส่ง header `X-Shop-Id`
- เครดิตฟรี 20 เครดิต เฉพาะ**ร้านแรก**ของผู้ใช้
- ราคาแพ็กเกจใน mockup (฿150/100, ฿600/500, ฿2,000/2,000) เป็น**ตัวเลขสมมติ** ยังไม่ final

## 5. API contract (backend พร้อมใช้แล้ว)

Base URL: env `NEXT_PUBLIC_API_URL` (dev = http://localhost:3000)

- `POST /auth/social` `{provider: "google"|"facebook"|"line", credential}` → `{token, is_new_user, user}`
  (credential = id_token จาก Google/LINE, access_token จาก Facebook — frontend ทำ OAuth flow เอง)
- Dashboard ทุกเส้น: header `Authorization: Bearer <jwt>` + `X-Shop-Id: <shop uuid>`
  - `GET/POST /shops` (list/สร้างร้าน — ใช้แค่ JWT ไม่ต้องมี X-Shop-Id)
  - `GET/POST/DELETE /shops/bank-accounts` · `GET/POST /shops/api-keys` (+`/:id/rotate`)
  - `GET/POST /shops/webhooks` · `GET /shops/topup/packages|orders`, `POST /shops/topup/orders`
- Public API ของลูกค้า (แสดงในหน้า docs): `POST /v1/verify` (header `Idempotency-Key`),
  `GET /v1/verify/:id`, `GET /v1/credits/balance`, `GET /v1/usage`
- Error envelope: `{error: {code, message}}` — code เช่น `insufficient_credits`, `duplicate_slip`,
  `invalid_qr`, `provider_unavailable`, `tenant_suspended`
- ⚠️ Backend ยังไม่เปิด CORS — ต้องไปเพิ่ม `app.enableCors()` ใน main.ts ของ core-api ตอนเชื่อมจริง

## 6. สถานะปัจจุบัน (อัปเดต 12 ก.ค. 2026)

- ✅ หน้า public ครบ: `/` (landing เต็มตาม mockup), `/pricing`, `/login`, `/register`
- ✅ **Google OAuth ใช้งานได้จริงแล้ว** — ทดสอบ end-to-end ผ่าน: GIS button → `/auth/social` →
  JWT → `/dashboard` → สร้างร้านแรก + รับ 20 เครดิต · Client ID อยู่ใน `.env.local`
  (โปรเจกต์ GCP: `proapp-slipjing`) · Facebook/LINE ยังเป็นปุ่ม disabled "เร็วๆ นี้"
- ✅ `/dashboard` เริ่มต้น: list ร้าน/สร้างร้าน/สลับร้าน/logout (`src/lib/api.ts` = API client กลาง)
- ✅ `/dashboard/bank-accounts`: เพิ่ม/ลบ/ดูบัญชีธนาคารของร้าน — ใช้ `DashboardShell`
  (sidebar ตาม mockup, เมนูที่ยังไม่ทำติด "เร็วๆ นี้") · flow: สร้างร้าน/เลือกร้าน → เข้าหน้านี้ทันที ·
  ทดสอบ API จริงแล้วรวม cross-tenant 403 · รายชื่อธนาคาร+รหัส BOT อยู่ `src/lib/banks.ts`
- ⏳ คิวถัดไป: API keys → ภาพรวม/ประวัติตรวจ/เติมเครดิต/webhooks ตาม mockup ·
  หน้า ToS/PDPA (บังคับก่อน launch) · ลิงก์ "เอกสาร API" ยังชี้ #

## 7. Conventions

- commit เป็น conventional commits · push ไป github.com/proappservice (ssh host alias `github-proapp`)
- อย่า gold-plate — Phase 1 ทำให้ครบตาม mockup ก่อน ความหรูไว้ทีหลัง
- ห้าม log/แสดง JWT หรือ API key เต็มใน UI ยกเว้นตอนสร้าง key ครั้งแรก (แสดงครั้งเดียว + ปุ่มคัดลอก)
