import ProductSection from "@/components/ProductSection";
import React from "react";
import StoreHero from "@/components/StoreHero";
import { getTranslations } from "next-intl/server";
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
  const t = await getTranslations("Storefront");
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
    <main>
      <JsonLd data={itemListJsonLd} />
      <StoreHero title={t("collectionTitle")} cta={t("collectionTitle")} product={products.find(p => p.image && p.categoryKey?.toLowerCase() === "electronics") ?? products.find(p => p.image)} collection />
      <div className="mx-auto max-w-[1600px] px-5 py-12 sm:px-8 lg:px-12"><ProductSection products={products} categories={products} /></div>
    </main>
  );
}
