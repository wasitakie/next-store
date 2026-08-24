import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { buildSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = buildSeoMetadata({
  locale: "th",
  path: "/",
  title: "NextStore | สินค้าไอที แกดเจ็ต และอุปกรณ์เสริม",
  description:
    "ช้อปสินค้าเทคโนโลยีคุณภาพ ราคาเข้าถึงง่าย พร้อมจัดส่งรวดเร็วและบริการหลังการขายจาก NextStore",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}
