# Project Context: Next.js 16 + Prisma 7 Production Stack

ไฟล์นี้สรุปบริบท โครงสร้างเทคโนโลยี และแนวทางการพัฒนาโปรเจกต์สำหรับนักพัฒนา และระบบอัตโนมัติ (AI/CI-CD) เพื่อให้เข้าใจทิศทางของระบบตรงกัน

---

## 🛠️ Tech Stack & Architecture

### 1. Frontend & Backend Framework: Next.js 16 (App Router)

- **Runtime:** Node.js 20.x+ (LTS) เท่านั้น
- **Data Fetching:** ใช้ Server Components เป็นหลัก ร่วมกับสถาปัตยกรรมแบบ Async APIs เต็มรูปแบบ (การรับค่า `params` และ `searchParams` ใน Page/Layout ต้องทำผ่าน `await` เสมอ)

### 2. Database ORM: Prisma 7

- **Engine:** เทคโนโลยีใหม่ Pure-TypeScript & WebAssembly (WASM Engine) ลาขาดจาก Rust Query Engine ตัวเก่า ทำให้ Cold Start บนสภาพแวดล้อม Serverless เร็วขึ้นอย่างมหาศาล และลด Bundle Size ลงกว่า 25MB
- **Type Safety:** รองรับฟีเจอร์ `$queryRawTyped` สำหรับการเขียน SQL Raw Queries ที่ยังคงรักษา Type Safety ไว้ได้ตั้งแต่ขั้นตอนการ Build
- **Generated Path:** ตัว Prisma Client ถูกย้ายจุดคอมไพล์เริ่มต้นไปไว้ที่ `@/generated/prisma/client` (หรือตามที่กำหนดใน `generator` ของ `schema.prisma`)

### 3. Package Manager: pnpm

- เน้นความเร็วในการติดตั้งและการทำ Caching ที่มีประสิทธิภาพสูง ทั้งในเครื่อง Local และบนระบบ Docker Build

---

## 💻 Environments & Workflow

ระบบถูกแยกกระบวนการทำงานออกเป็น 2 สภาพแวดล้อมหลักอย่างชัดเจน:

### 1. Development Environment (Local Machine)

เน้นความเร็วในการเขียนโค้ดและเห็นผลลัพธ์ทันที (Hot Reload) โดยไม่จำเป็นต้องสั่ง Build Docker ใหม่ทุกครั้งที่แก้ไขไฟล์

- **คำสั่งรันระบบ:** `pnpm prisma db push && pnpm prisma generate && next dev` (สั่งอัปเดตสคีมาฐานข้อมูล เคลียร์ Type แล้วเปิดเซิร์ฟเวอร์ในคำสั่งเดียว)
- **Local URL:** `http://localhost:3000`
- **การแก้ไขโค้ด:** ทำผ่าน Editor บนเครื่อง Local ได้ทันที หากมีการแก้สคีมาฐานข้อมูล ให้รันคำสั่งกลุ่ม `prisma` เพื่ออัปเดต Type เสมอ

### 2. Production Environment (Docker & Vercel)

เมื่อแอปพลิเคชันเสร็จสมบูรณ์และพร้อมจะปล่อยใช้งานจริง

- **ทางเลือกที่ 1: Docker (Multi-stage Build)**
  - ใช้ภาพต้นแบบ `node:20-alpine` เพื่อประหยัดพื้นที่ดิสก์
  - กระบวนการ Build แยกออกเป็นสเตจ (Dependencies -> Installer -> Builder -> Runner) เพื่อให้ได้ Image เวอร์ชันโปรดักชันที่มีขนาดเล็กที่สุด (ใช้ฟีเจอร์ `standalone` ของ Next.js)
  - **คำสั่งล้างขยะ (Disk Management):** บนเซิร์ฟเวอร์จริงจะใช้ `docker system prune` หรือ `docker image prune -a` เป็นประจำเพื่อลบ Images เก่าที่ไม่ได้ใช้ เพื่อป้องกันดิสก์เต็ม **(คำเตือน: ห้ามสั่งลบ Docker Volumes สุ่มสี่สุ่มห้าบน Production เพราะข้อมูลฐานข้อมูลจะหายสาบสูญ)**

- **ทางเลือกที่ 2: Vercel Deploy (Serverless)**
  - ปรับแต่งสคริปต์ใน `package.json` ให้สั่ง `"build": "prisma generate && next build"` เพื่อให้ Vercel สร้าง Prisma Client ก่อนทำกระบวนการสร้างหน้าเว็บ
  - การทำ Migration บนโปรดักชันจะใช้คำสั่ง `pnpm prisma db push` หรือ `prisma migrate deploy` ยิงตรงจากเครื่องนักพัฒนาไปหาฐานข้อมูลจริง (ผ่าน `DIRECT_URL`) แทนการรันบน Vercel

---

## ⚠️ Critical Notes (ข้อควรระวังพิเศษ)

1.  **Port Conflict:** ระวังพอร์ตชนกัน หากเครื่อง Local กำลังเปิด `pnpm dev` (Port 3000) อยู่ จะไม่สามารถสั่งรัน Docker Container มาที่ Port 3000 ซ้ำกันได้ ต้องปิดเซิร์ฟเวอร์ Local ก่อนทุกครั้ง
2.  **Docker Build Context:** ทันทีที่สั่ง `docker build .` ตัว Docker จะดึงภาพสแนปชอตของโค้ด ณ วินาทีนั้นไปทำงาน โค้ดที่แก้เพิ่มหลังจากนั้นบน Local จะไม่มีผลกับ Image ตัวที่กำลัง Build อยู่ (ต้องสั่ง Build ใหม่เมื่อแก้โค้ดเสร็จ)
3.  **Database Connection:** ใน Prisma 7 แนะนำให้บริหารจัดการ Connection String และตัวแปรสภาพแวดล้อมผ่าน `prisma.config.ts` สำหรับงานที่มีความซับซ้อนสูง
