import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { prisma } from "@/lib/prisma";
import { getTranslations } from "next-intl/server";
import { localizeProduct } from "@/lib/utils";
import ProductCarousel from "@/components/ProductCarousel";
import { Suspense } from "react";
import CategoryTitle from "@/components/CategoryTitle";
import ProductSection from "@/components/ProductSection";
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
    path: "/",
    title: isEnglish
      ? "NextStore | IT, Gadgets, and Accessories"
      : "NextStore | ร้านไอที แกดเจ็ต และอุปกรณ์เสริม",
    description: isEnglish
      ? "Shop quality tech products, gadgets, and accessories with fast delivery and trusted warranty."
      : "เลือกซื้อสินค้าไอที แกดเจ็ต และอุปกรณ์เสริมคุณภาพ พร้อมจัดส่งรวดเร็วและรับประกันอุ่นใจ",
  });
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("HomePage");
  const rawProducts = await prisma.product.findMany();

  const products = rawProducts.map((p) => localizeProduct(p, locale));

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white">
      {/* Featured products carousel */}

      <Suspense fallback={<div>Loading...</div>}>
        <ProductCarousel product={products} />
      </Suspense>

      {/* Featured Categories */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">
              {t("shopFromCategories")}
            </h2>
            <p className="text-slate-500 mt-2">{t("premiumForYou")}</p>
          </div>
        </div>
        <div className="mt-5">
          <CategoryTitle categories={products} locale={locale} />
        </div>
      </div>

      {/* Filterable Products */}
      <div className="mt-5 px-4 sm:px-6 lg:px-8 py-12 ">
        <ProductSection products={products} categories={products} />
      </div>

      {/* Newsletter */}
      <section className="py-16 bg-indigo-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold mb-4">{t("newsletterTitle")}</h3>
          <p className="text-xl mb-8 text-indigo-100">{t("newsletterDesc")}</p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              type="email"
              placeholder={t("emailPlaceholder")}
              className="flex-1 bg-white text-gray-900 focus:ring-2 focus:ring-white"
            />
            <Button className="bg-white text-indigo-600 hover:bg-gray-100">
              {t("subscribe")}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
