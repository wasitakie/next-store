import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import * as dotenv from 'dotenv';


dotenv.config();
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createAdapter() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not defined");
  }

  const url = new URL(databaseUrl);

  return new PrismaMariaDb({
    host: url.hostname,
    port: url.port ? Number(url.port) : 3306,
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    database: url.pathname.replace(/^\//, ""),
  });
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter: createAdapter(),
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;


async function main() {
  console.log("ล้างข้อมูลสินค้าเดิม...");
  await prisma.product.deleteMany();

  const products = [
  {
    // id จะถูกสร้างอัตโนมัติโดย @default(autoincrement())
    slug: "medium-roast-arabica-coffee-doi-chang",
    name_th: "กาแฟอาราบิก้าคั่วกลาง",
    name_en: "Medium Roast Arabica Coffee - Doi Chang",
    description_th: "กาแฟพิเศษจากดอยช้าง คั่วสดใหม่ หอมกลิ่นช็อกโกแลตและถั่ว บรรจุ 250 กรัม",
    description_en: "Specialty coffee from Doi Chang, freshly roasted with chocolate and nutty notes. 250g pack.",
    price: 450,
    stock: 120,
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80",
    category_th: "เครื่องดื่ม",
    category_en: "Beverages"
  },
  {
    slug: "high-performance-laptop-16gb-512gb",
    name_th: "แล็ปท็อปทำงานประสิทธิภาพสูง",
    name_en: "High Performance Laptop - 16GB RAM 512GB SSD",
    description_th: "จอ 15.6 นิ้ว RAM 16GB SSD 512GB เหมาะสำหรับงานกราฟิกและโปรแกรมมิ่ง",
    description_en: "15.6-inch display, 16GB RAM, 512GB SSD. Ideal for graphic design and programming.",
    price: 32900,
    stock: 45,
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80",
    category_th: "อิเล็กทรอนิกส์",
    category_en: "Electronics"
  },
  {
    slug: "minimalist-canvas-sneakers-comfort",
    name_th: "รองเท้าผ้าใบสไตล์มินิมอล",
    name_en: "Minimalist Canvas Sneakers - Comfort Fit",
    description_th: "น้ำหนักเบา พื้นรองเท้านุ่ม กันลื่น สวมใส่สบายตลอดวัน ขนาด 39-44",
    description_en: "Lightweight with soft cushioned sole, non-slip, all-day comfort. Sizes 39-44.",
    price: 1890,
    stock: 200,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
    category_th: "แฟชั่น",
    category_en: "Fashion"
  },
  {
    slug: "detective-mystery-novel-thriller",
    name_th: "นวนิยายแนวสืบสวนสอบสวน",
    name_en: "Detective Mystery Novel - Thriller Edition",
    description_th: "เรื่องราวลึกลับที่ซ่อนปมซับซ้อน จบแบบหักมุม ฉบับพิมพ์ครั้งที่ 3 ปกอ่อน",
    description_en: "A complex mystery with unexpected twists. 3rd printing, paperback edition.",
    price: 290,
    stock: 85,
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&q=80",
    category_th: "หนังสือ",
    category_en: "Books"
  },
  {
    slug: "ceramic-plant-pot-minimal-design",
    name_th: "กระถางต้นไม้เซรามิก",
    name_en: "Ceramic Plant Pot - Minimal Design",
    description_th: "วัสดุทนน้ำ ดีไซน์เรียบง่าย ขนาดเส้นผ่านศูนย์กลาง 15 ซม. พร้อมถาดรองน้ำ",
    description_en: "Water-resistant ceramic, minimalist design, 15cm diameter with drainage tray.",
    price: 350,
    stock: 150,
    image: "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=800&q=80",
    category_th: "ของตกแต่งบ้าน",
    category_en: "Home Decor"
  },
  {
    slug: "leather-strap-wristwatch-waterproof",
    name_th: "นาฬิกาข้อมือสายหนัง",
    name_en: "Leather Strap Wristwatch - 50M Waterproof",
    description_th: "เคลือบกันน้ำลึก 50 เมตร เครื่องควอตซ์ญี่ปุ่น สายหนังแท้ปรับขนาดได้",
    description_en: "50-meter water resistance, Japanese quartz movement, adjustable genuine leather strap.",
    price: 4500,
    stock: 60,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
    category_th: "เครื่องประดับ",
    category_en: "Accessories"
  },
  {
    slug: "wireless-noise-cancelling-headphones-bt53",
    name_th: "หูฟังไร้สายตัดเสียงรบกวน",
    name_en: "Wireless Noise-Cancelling Headphones - Bluetooth 5.3",
    description_th: "แบตเตอรี่ใช้งาน 30 ชม. รองรับ Bluetooth 5.3 เสียงเบสแน่น พับเก็บได้",
    description_en: "30-hour battery life, Bluetooth 5.3, deep bass, foldable design for portability.",
    price: 2890,
    stock: 95,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
    category_th: "อุปกรณ์เสียง",
    category_en: "Audio Equipment"
  },
  {
    slug: "denim-chest-bag-waterproof-street-style",
    name_th: "กระเป๋าคาดอกผ้ายีนส์",
    name_en: "Denim Chest Bag - Waterproof Street Style",
    description_th: "ซิปกันน้ำ ช่องเก็บของ 5 ช่อง สายปรับความยาวได้ สไตล์สตรีท",
    description_en: "Waterproof zippers, 5 storage compartments, adjustable strap, urban street style.",
    price: 790,
    stock: 110,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80",
    category_th: "กระเป๋าและเครื่องหนัง",
    category_en: "Bags & Leather Goods"
  },
  {
    slug: "polarized-sunglasses-titanium-uv400",
    name_th: "แว่นกันแดดเลนส์โพลาไรซ์",
    name_en: "Polarized Sunglasses - Titanium Frame UV400",
    description_th: "กรอบไทเทเนียม น้ำหนักเบา ป้องกันรังสี UV400 ครอบคลุม 100%",
    description_en: "Lightweight titanium frame, 100% UV400 protection, polarized lenses for glare reduction.",
    price: 1250,
    stock: 75,
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80",
    category_th: "เครื่องประดับแฟชั่น",
    category_en: "Fashion Accessories"
  },
  {
    slug: "mirrorless-digital-camera-24mp-4k",
    name_th: "กล้องดิจิตอลมิเรอร์เลส",
    name_en: "Mirrorless Digital Camera - 24MP APS-C 4K Video",
    description_th: "เซนเซอร์ APS-C 24MP วิดีโอ 4K 60fps น้ำหนักเบาพกพาง่าย พร้อมเลนส์คิต",
    description_en: "24MP APS-C sensor, 4K 60fps video recording, lightweight body with kit lens included.",
    price: 28500,
    stock: 30,
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80",
    category_th: "อุปกรณ์ถ่ายภาพ",
    category_en: "Photography Equipment"
  }
];

console.log("กำลังเริ่มเพิ่มข้อมูลสินค้า...");

// การใช้ createMany ใน MySQL/Postgres จะเร็วกว่าวนลูป
await prisma.product.createMany({
  data: products,
});
}
main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });