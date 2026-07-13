# slipjing-web

Frontend ของ SlipJing (slipjing.com) — เว็บสาธารณะ + Dashboard ร้านค้า
Next.js (App Router) + TypeScript + Tailwind CSS · UI ภาษาไทย
บริบทโปรเจกต์/การตัดสินใจทั้งหมดอยู่ที่ [CLAUDE.md](CLAUDE.md) · backend อยู่ repo [slipjing-core-api](https://github.com/proappservice/slipjing-core-api)

## พอร์ตที่ใช้ (จำชุดนี้ไว้)

| ส่วน | พอร์ต | ที่มา |
|---|---|---|
| **เว็บ (repo นี้)** | **3001** | ตั้งไว้ใน script `npm run dev` แล้ว ไม่ต้องใส่ flag เอง |
| Backend API | 3000 | `slipjing-core-api` → `npm run start:dev` |
| PostgreSQL | 5433 | docker ของ backend (`npm run db:up`) |

## รันบนเครื่อง local

### ครั้งแรก (setup)

```bash
cd slipjing-web
npm install
cp .env.example .env.local   # ⚠️ ถ้ามี .env.local ที่มี GOOGLE_CLIENT_ID อยู่แล้ว ห้ามทับ — ข้ามขั้นนี้
```

ค่าใน `.env.local` ที่ต้องมี:

```
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_GOOGLE_CLIENT_ID=<Client ID จาก Google Cloud Console โปรเจกต์ proapp-slipjing>
```

### รันทุกวัน (ต้องเปิด backend ก่อนเสมอ ไม่งั้น login/dashboard ยิง API ไม่ได้)

```bash
# terminal 1 — backend + database
cd ../slipjing-core-api
npm run db:up          # Postgres (docker) — ข้ามได้ถ้า container รันอยู่
npm run start:dev      # API ที่ :3000

# terminal 2 — เว็บ (repo นี้)
npm run dev            # http://localhost:3001 (พอร์ต 3001 อัตโนมัติ, แก้โค้ดแล้ว reload เอง)
```

### ทดสอบว่าใช้งานได้

1. เปิด http://localhost:3001 — เห็น landing page
2. กด "เข้าสู่ระบบ" → ปุ่ม Google → login (บัญชีต้องอยู่ใน Test users ของ OAuth consent screen)
3. เข้า dashboard → เห็นร้าน/สร้างร้านได้ = ครบวงจร

## คำสั่งอื่น

```bash
npm run build   # typecheck + build production (หน้า public ต้องขึ้น ○ Static ทั้งหมด)
npm run start   # เสิร์ฟ production build ที่ :3001
npm run lint    # eslint
```

## ปัญหาที่เจอบ่อย

| อาการ | วิธีแก้ |
|---|---|
| หน้า login ขึ้นกล่อง "ยังไม่ได้ตั้งค่า NEXT_PUBLIC_GOOGLE_CLIENT_ID" | ใส่ค่าใน `.env.local` แล้ว **restart** `npm run dev` (env อ่านตอน start เท่านั้น) |
| กด Google แล้ว error `origin_mismatch` | เพิ่ม `http://localhost:3001` ใน Authorized JavaScript origins ของ OAuth client |
| Dashboard โหลดข้อมูลไม่ขึ้น / network error | backend ยังไม่รัน (`:3000`) หรือ Postgres ยังไม่ขึ้น — ดู terminal 1 |
| พอร์ต 3001 ถูกใช้อยู่ | `lsof -ti :3001 | xargs kill` แล้วรันใหม่ |
