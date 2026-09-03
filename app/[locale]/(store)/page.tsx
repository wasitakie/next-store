import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { prisma } from "@/lib/prisma";
import { getTranslations } from "next-intl/server";
import { localizeProduct } from "@/lib/utils";
import ProductCarousel from "@/components/ProductCarousel";
import { Suspense } from "react";
import CategoryTitle from "@/components/CategoryTitle";
import ProductSection from "@/components/ProductSection";
import JsonLd from "@/components/JsonLd";
import { absoluteUrl, buildSeoMetadata } from "@/lib/seo";
import { CreditCard, ShieldCheck, Truck } from "lucide-react";
import type { Metadata } from "next";
import { ProductGridSkeleton } from "@/components/ui/state";

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
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: products.slice(0, 12).map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: absoluteUrl(`/${locale}/products/${product.slug}`),
      name: product.name,
    })),
  };

  return (
    <div className="min-h-screen bg-background">
      <JsonLd data={itemListJsonLd} />
      {/* Featured products carousel */}

      <Suspense
        fallback={
          <div className="border-b border-slate-200 bg-white px-4 py-12 sm:px-6 lg:px-8">
            <ProductGridSkeleton count={4} />
          </div>
        }
      >
        <ProductCarousel product={products} />
      </Suspense>

      <section className="border-b border-slate-200 bg-white">
        <div className="container mx-auto grid gap-3 px-4 py-4 sm:grid-cols-3 sm:px-6 lg:px-8">
          <TrustItem icon={Truck} label={t("freeShipping")} />
          <TrustItem icon={ShieldCheck} label={t("trustedWarranty")} />
          <TrustItem icon={CreditCard} label={t("securePayment")} />
        </div>
      </section>

      {/* Filterable Products */}
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="container mx-auto mb-8">
          <h2 className="text-3xl font-bold text-slate-950">
            {t("featuredProducts")}
          </h2>
          <p className="mt-2 max-w-2xl text-slate-500">
            {t("featuredProductsDesc")}
          </p>
        </div>
        <ProductSection products={products} categories={products} />
      </section>

      {/* Featured Categories */}
      <div className="container mx-auto px-4 pb-12 sm:px-6 lg:px-8">
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

      {/* Newsletter */}
      <section className="border-y border-slate-200 bg-white py-16 text-slate-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold mb-4">{t("newsletterTitle")}</h3>
          <p className="mb-8 text-lg text-slate-500">{t("newsletterDesc")}</p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              type="email"
              placeholder={t("emailPlaceholder")}
              className="flex-1 border-slate-200 bg-slate-50 text-slate-900"
            />
            <Button className="bg-orange-500 text-white hover:bg-orange-600">
              {t("subscribe")}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

function TrustItem({
  icon: Icon,
  label,
}: {
  icon: typeof Truck;
  label: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
      <Icon className="h-4 w-4 text-orange-500" />
      <span>{label}</span>
    </div>
  );
}
