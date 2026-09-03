# NextStore Case Study

NextStore คือโปรเจกต์ e-commerce สำหรับสินค้าไอที แกดเจ็ต และอุปกรณ์เสริม พัฒนาเป็นกรณีศึกษาเพื่อทดลองออกแบบร้านค้าที่ให้ความรู้สึกทันสมัย น่าเชื่อถือ และพร้อมต่อยอดสู่ระบบขายจริง โดยใช้ Next.js App Router, React, TypeScript, Tailwind CSS, Prisma, NextAuth และ Stripe Checkout

เป้าหมายของโปรเจกต์ไม่ใช่แค่ทำหน้าร้านให้สวย แต่ต้องแสดงให้เห็นกระบวนการคิดแบบ product engineering ตั้งแต่ประสบการณ์ผู้ซื้อ การจัดการหลังบ้าน ความถูกต้องของข้อมูลคำสั่งซื้อ ไปจนถึงโครงสร้างที่รองรับหลายภาษาและการ deploy

## Executive Summary

| หัวข้อ | รายละเอียด |
| --- | --- |
| ประเภทโปรเจกต์ | Localized e-commerce web application |
| กลุ่มสินค้า | IT products, gadgets, accessories |
| กลุ่มผู้ใช้ | ลูกค้าทั่วไปและผู้ดูแลร้าน |
| Default locale | ภาษาไทย (`th`) |
| Secondary locale | ภาษาอังกฤษ (`en`) |
| Core stack | Next.js, React, TypeScript, Tailwind CSS, Prisma, MySQL, NextAuth, Stripe |
| Key outcome | หน้าร้านสองภาษา พร้อมตะกร้า checkout คำสั่งซื้อ และ admin dashboard |

## Problem

ร้านค้าออนไลน์ขนาดเล็กถึงกลางมักเริ่มจากหน้าโชว์สินค้า แต่เมื่อเริ่มขายจริงจะเจอปัญหาซ้ำ ๆ เช่น ข้อมูลสินค้าไม่สอดคล้องกันหลายภาษา สต็อกไม่ถูกตัดอย่างปลอดภัย ประสบการณ์ checkout ไม่ต่อเนื่อง และหลังบ้านไม่มีเครื่องมือจัดการสินค้า/คำสั่งซื้อที่เรียบง่าย

กรณีศึกษานี้จึงตั้งโจทย์ว่า: จะสร้าง e-commerce ที่ดูเป็นแบรนด์เทคสมัยใหม่ ใช้งานง่ายในฝั่งลูกค้า และยังมีโครงสร้าง backend ที่ชัดพอสำหรับการต่อยอดได้อย่างไร

## Goals

- สร้าง storefront ที่ product-first และเน้น conversion
- รองรับภาษาไทยและอังกฤษผ่าน route แบบ locale-aware
- จัดการสินค้าแบบ localized fields เช่นชื่อ คำอธิบาย และหมวดหมู่
- มีตะกร้าสินค้าที่ตรวจสอบ stock ก่อนเพิ่มหรืออัปเดตจำนวน
- สร้าง order พร้อม price snapshot เพื่อรักษาความถูกต้องของประวัติคำสั่งซื้อ
- รองรับ authentication ด้วย Credentials และ Google OAuth
- แยก role ระหว่าง `user` และ `admin`
- มี admin dashboard สำหรับจัดการสินค้าและคำสั่งซื้อ
- รองรับ payment flow ผ่าน Stripe Checkout พร้อม fallback payment methods
- เตรียม production path ผ่าน standalone Next.js output และ Docker

## Product Experience

### Storefront

หน้าร้านถูกออกแบบให้ลูกค้าเห็นสินค้าและเหตุผลในการตัดสินใจซื้ออย่างรวดเร็ว หน้าแรกประกอบด้วย carousel สินค้าเด่น, trust bar, product section, category browsing และ newsletter section

หน้า products ใช้ข้อมูลจากฐานข้อมูลผ่าน Server Components แล้วแปลงข้อมูลสินค้าให้ตรงกับ locale ปัจจุบัน เช่น `name_th` หรือ `name_en` เพื่อให้หน้าร้านใช้ data source เดียวแต่แสดงผลได้สองภาษา

### Cart And Checkout

ระบบตะกร้าใช้ cookie เป็น storage ฝั่ง server และเชื่อมกับ Zustand ในฝั่ง client เพื่อให้ UX ตอบสนองเร็ว เมื่อเพิ่มสินค้า ระบบตรวจสอบว่าสินค้ามีอยู่จริงและ stock เพียงพอ ก่อนบันทึกตะกร้า

เมื่อ checkout ระบบจะสร้าง order ภายใน transaction:

- ตรวจ stock ของสินค้าทุกชิ้น
- สร้าง order เป็นสถานะ `pending`
- สร้าง order items พร้อมราคา ณ เวลาสั่งซื้อ
- ตัด stock ของสินค้า
- ล้างตะกร้าเมื่อ flow สำเร็จ

สำหรับการชำระเงินผ่าน Stripe ระบบสร้าง Checkout Session พร้อม metadata ของ `orderId` และ `userId` เพื่อให้ webhook หรือ flow หลังชำระเงินสามารถอ้างอิงคำสั่งซื้อได้ถูกต้อง

### Admin

หลังบ้านถูกจำกัดด้วย `requireAdmin()` เพื่อให้เฉพาะผู้ดูแลเข้าถึงได้ หน้าจัดการสินค้ารองรับการดูรายการ เพิ่ม แก้ไข และลบสินค้า ส่วนคำสั่งซื้อรองรับการดูและอัปเดตสถานะ เช่น `pending`, `paid`, `shipped`, `delivered`, และ `cancelled`

## Design Strategy

ทิศทางภาพรวมของ UI คือ "modern tech and trust" ใช้พื้นหลังสะอาด เนื้อหาอ่านง่าย และ CTA สีส้มเพื่อดึงสายตาในจุดที่ต้องการ action

### Color System

| บทบาท | สี | เหตุผล |
| --- | --- | --- |
| Base | `#F8FAFC` / slate background | ให้ความรู้สึกสะอาด สว่าง และเหมาะกับสินค้าเทค |
| Core | deep blue / slate text | สื่อความน่าเชื่อถือ ความมั่นคง และความเป็นมืออาชีพ |
| Accent | orange CTA | ใช้กับปุ่มและจุดตัดสินใจซื้อเพื่อสร้างแรงกระตุ้น |
| Feedback | emerald, amber, red | ใช้กับสถานะ stock และ order เพื่อสแกนข้อมูลได้เร็ว |

### UI Principles

- Product-first: ให้ภาพสินค้า ราคา หมวดหมู่ และ CTA อยู่ในลำดับที่เห็นง่าย
- Trust cues: ใช้ข้อความและ icon เช่นจัดส่งฟรี รับประกัน และชำระเงินปลอดภัย
- Admin density: หน้า admin ใช้ table และ controls ที่สแกนง่าย มากกว่าการตกแต่งแบบ landing page
- Responsive layout: grid และ checkout layout ปรับจาก mobile เป็น desktop โดยยังรักษาความอ่านง่าย

## Architecture

```mermaid
flowchart TD
  A["Customer / Admin"] --> B["Next.js App Router"]
  B --> C["Server Components"]
  B --> D["Client Components"]
  C --> E["Prisma Client"]
  E --> F["MySQL / MariaDB"]
  D --> G["Zustand Cart Store"]
  B --> H["NextAuth"]
  H --> E
  B --> I["Server Actions"]
  I --> E
  I --> J["Stripe Checkout API"]
```

### Frontend

- Next.js App Router with locale routes under `app/[locale]`
- Server Components สำหรับ data fetching เป็นหลัก
- Client Components เฉพาะส่วนที่ต้องใช้ hooks, event handlers หรือ local state
- Tailwind CSS และ shadcn-style primitives ใน `components/ui`
- `lucide-react` สำหรับ icon ในปุ่มและ controls

### Backend

- Server Actions สำหรับ cart, order และ product workflows
- Prisma เป็น data layer กลางผ่าน `lib/prisma.ts`
- MySQL เป็นฐานข้อมูลหลัก
- NextAuth v5 beta สำหรับ session และ provider integration
- Stripe Checkout ใช้ direct API request เพื่อสร้าง payment session

## Data Model

โมเดลหลักประกอบด้วย:

- `User`: ข้อมูลผู้ใช้ role และความสัมพันธ์กับ account/session/order
- `Product`: สินค้าพร้อม localized fields, price, stock, image และ category
- `Order`: คำสั่งซื้อพร้อม total, status และ user owner
- `OrderItem`: รายการสินค้าในคำสั่งซื้อ พร้อม price snapshot
- `Account`, `Session`, `VerificationToken`: โครงสร้างสำหรับ NextAuth

แนวคิดสำคัญคือ `OrderItem.price` เก็บราคาตอนสั่งซื้อ เพื่อไม่ให้ order เก่าเปลี่ยนยอดรวมเมื่อราคาสินค้าปัจจุบันเปลี่ยนในภายหลัง

## Key Features

- หน้าร้านสองภาษาไทย/อังกฤษ
- localized SEO metadata และ JSON-LD สำหรับ product lists
- รายการสินค้าและหน้ารายละเอียดสินค้า
- ค้นหา/กรองสินค้าและหมวดหมู่
- wishlist store
- cart store พร้อม server-action sync
- checkout พร้อมตัวเลือก Stripe, cash on delivery และ bank transfer
- authentication ด้วย email/password และ Google
- role-based admin routes
- product management สำหรับ admin
- order management สำหรับ admin
- Docker setup พร้อม MySQL local service

## Tech Stack

| Layer | Technology |
| --- | --- |
| Framework | Next.js App Router |
| Language | TypeScript |
| UI | React, Tailwind CSS, shadcn-style components |
| Icons | lucide-react |
| State | Zustand |
| Forms / Validation | react-hook-form, zod |
| Auth | NextAuth v5 beta, Prisma Adapter, bcryptjs |
| Database | MySQL / MariaDB |
| ORM | Prisma |
| Payment | Stripe Checkout |
| Package manager | pnpm |
| Deployment | Docker, standalone Next.js output |

## Project Structure

```text
app/[locale]                 Locale-aware routes
app/[locale]/(store)         Public storefront pages
app/[locale]/admin           Admin dashboard pages
components                   Shared storefront components
components/ui                shadcn-style UI primitives
components/admin             Admin navigation and controls
lib/actions                  Server actions
lib/store                    Zustand stores
lib/auth.ts                  NextAuth runtime setup
lib/prisma.ts                Prisma singleton
messages                     Translation catalogs
prisma/schema.prisma         Database schema
prisma/seed.ts               Seed data
scripts/promote-admin.ts     Admin promotion utility
```

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm
- Docker, ถ้าต้องการรัน MySQL local ผ่าน `docker-compose.yml`

### Environment Variables

สร้างไฟล์ `.env` แล้วกำหนดค่าหลักตามนี้:

```bash
DATABASE_URL="mysql://nextstore:nextstore1234@localhost:3308/nextstore"
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
STRIPE_SECRET_KEY=""
STRIPE_WEBHOOK_SECRET=""
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Install

```bash
pnpm install
```

### Start Local Database

```bash
docker compose up -d mysql
```

### Sync Database And Seed

```bash
pnpm prisma db push
pnpm prisma generate
pnpm db:seed
```

หมายเหตุ: สคริปต์ `db:seed` ใน `package.json` ใช้ `.env.prod` ผ่าน `dotenv-cli` หากต้องการ seed ด้วย `.env` local สามารถใช้คำสั่งนี้แทน:

```bash
pnpm prisma db seed
```

### Run Development Server

```bash
pnpm dev
```

เปิดใช้งานที่:

```text
http://localhost:3000
```

## Useful Commands

| Command | Purpose |
| --- | --- |
| `pnpm dev` | รัน development server |
| `pnpm lint` | ตรวจ lint |
| `pnpm build` | build production |
| `pnpm prisma generate` | generate Prisma Client |
| `pnpm prisma db push` | sync schema กับฐานข้อมูล local |
| `pnpm db:seed` | seed database |
| `pnpm promote-admin` | promote user เป็น admin |
| `pnpm docker-build` | sync schema, generate Prisma และ build app |

## Case Study Notes

### What Worked Well

- การใช้ localized fields ใน `Product` ทำให้ query ง่ายและเหมาะกับ catalog ขนาดเล็กถึงกลาง
- Server Components ลดการส่ง logic data fetching ไปฝั่ง client
- การสร้าง order ใน transaction ช่วยให้ order items และ stock update สอดคล้องกัน
- price snapshot ใน `OrderItem` ช่วยรักษาความถูกต้องของประวัติการขาย
- role-based access แยกพื้นที่ admin ออกจาก storefront ชัดเจน

### Trade-offs

- Cart เก็บใน cookie จึงเหมาะกับตะกร้าขนาดไม่ใหญ่มาก หาก catalog และ cart complexity สูงขึ้นควรย้ายเป็น database-backed cart
- localized fields แบบแยก column ทำงานง่าย แต่ถ้ารองรับหลายภาษามากขึ้นควรพิจารณา translation table
- checkout form เก็บข้อมูล shipping ใน UI แล้วสร้าง order หลักจาก cart เป็นหลัก หากใช้งาน production จริงควรเพิ่ม address model และ validation ที่เข้มขึ้น
- manual order creation ใน admin ยังเป็น flow แบบเรียบง่าย ควรต่อยอดให้เพิ่ม order items ได้ครบถ้วน

### Next Improvements

- เพิ่ม database-backed cart สำหรับ logged-in users
- เพิ่ม address book และ shipping method
- เพิ่ม inventory audit log
- เพิ่ม Stripe webhook handling สำหรับยืนยัน payment status แบบ production-grade
- เพิ่ม order email notification
- เพิ่ม unit/integration tests สำหรับ cart, order transaction และ auth role guard
- เพิ่ม image upload workflow แทนการใช้ remote image URL อย่างเดียว

## Screens And Flows

```mermaid
flowchart LR
  A["Home"] --> B["Products"]
  B --> C["Product Detail"]
  C --> D["Cart"]
  D --> E["Checkout"]
  E --> F["Stripe / Alternative Payment"]
  F --> G["Order Success"]
  H["Admin Login"] --> I["Admin Dashboard"]
  I --> J["Products Management"]
  I --> K["Orders Management"]
```

## Result

NextStore แสดงภาพรวมของ e-commerce ที่ครบทั้งหน้าร้าน หลังบ้าน authentication, cart, order, stock handling, localization และ payment integration ใน codebase เดียว เหมาะสำหรับใช้เป็น portfolio case study หรือเป็นฐานสำหรับต่อยอดเป็นร้านค้าออนไลน์จริงในระดับ MVP
