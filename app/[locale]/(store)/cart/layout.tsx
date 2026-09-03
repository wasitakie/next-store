import type { Metadata } from "next";
import { buildSeoMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isEnglish = locale === "en";

  return buildSeoMetadata({
    locale,
    path: "/cart",
    title: isEnglish ? "Cart | NextStore" : "ตะกร้าสินค้า | NextStore",
    description: isEnglish
      ? "Review products in your cart before checkout."
      : "ตรวจสอบสินค้าในตะกร้าก่อนชำระเงิน",
    noIndex: true,
  });
}

export default function CartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
