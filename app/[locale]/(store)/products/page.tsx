import ProductSection from "@/components/ProductSection";
import React from "react";
import { prisma } from "@/lib/prisma";
import { localizeProduct } from "@/lib/utils";
import { buildSeoMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isEnglish = locale === "en";

  return buildSeoMetadata({
    locale,
    path: "/products",
    title: isEnglish
      ? "All Products | NextStore"
      : "สินค้าทั้งหมด | NextStore",
    description: isEnglish
      ? "Browse IT products, gadgets, accessories, and daily tech essentials from NextStore."
      : "รวมสินค้าไอที แกดเจ็ต อุปกรณ์เสริม และของใช้เทคโนโลยีจาก NextStore",
  });
}

export default async function ProductsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const rawProducts = await prisma.product.findMany();
  const products = rawProducts.map((p) => localizeProduct(p, locale));

  return (
    <div className="mt-5 px-4 sm:px-6 lg:px-8 py-6">
      <ProductSection products={products} categories={products} />
    </div>
  );
}
