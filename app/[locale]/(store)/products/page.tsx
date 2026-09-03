import ProductSection from "@/components/ProductSection";
import React from "react";
import { prisma } from "@/lib/prisma";
import { localizeProduct } from "@/lib/utils";
import JsonLd from "@/components/JsonLd";
import { absoluteUrl, buildSeoMetadata } from "@/lib/seo";
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
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: products.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: absoluteUrl(`/${locale}/products/${product.slug}`),
      name: product.name,
    })),
  };

  return (
    <div className="bg-background px-4 py-10 sm:px-6 lg:px-8">
      <JsonLd data={itemListJsonLd} />
      <ProductSection products={products} categories={products} />
    </div>
  );
}
