import StoreMotion from "@/components/storefront/StoreMotion";
import { prisma } from "@/lib/prisma";
import { getTranslations } from "next-intl/server";
import { localizeProduct } from "@/lib/utils";
import ProductCard from "@/components/ProductCard";
import { HomeHero, HomeSelection } from "@/components/storefront/HomeCollections";
import JsonLd from "@/components/JsonLd";
import { absoluteUrl, buildSeoMetadata } from "@/lib/seo";
import { ArrowUpRight, CreditCard, ShieldCheck, Truck } from "lucide-react";
import { Link } from "@/i18n/routing";
import Image from "next/image";
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

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations("HomePage");
  const e = await getTranslations("Storefront");
  const c = await getTranslations("EcomPages");
  const products = (await prisma.product.findMany({ orderBy: { createdAt: "desc" } })).map(p => localizeProduct(p, locale));
  const featured = products.find(p => p.image && p.stock > 0 && p.categoryKey?.toLowerCase() === "electronics") ?? products.find(p => p.image && p.stock > 0) ?? products.find(p => p.image);
  const categories = [...new Map(products.filter(p => p.category).map(p => [p.categoryKey || p.category, p])).values()].slice(0, 3);
  return (
    <StoreMotion>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "ItemList", itemListElement: products.slice(0, 8).map((p, i) => ({ "@type": "ListItem", position: i + 1, name: p.name, url: absoluteUrl(`/${locale}/products/${p.slug}`) })) }} />
      <HomeHero products={featured ? [featured, ...products.filter(p => p.id !== featured.id)] : products} />
      <section className="mx-auto max-w-[1600px] px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
        <div className="mb-9 flex flex-wrap items-end justify-between gap-5">
          <h2 className="text-3xl font-normal tracking-tight md:text-5xl">{e("newArrivals")}</h2>
          <Link href="/products" className="flex items-center gap-2 border-b border-neutral-950 pb-1 text-sm">{t("viewAllProducts")}<ArrowUpRight className="h-4 w-4" /></Link>
        </div>
        <ProductCard products={products.slice(0, 4)} />
      </section>
      <div className="overflow-hidden border-y border-neutral-200 py-8 text-center text-4xl font-normal uppercase tracking-tight sm:text-6xl lg:text-8xl">{c("statement")}</div>
      {categories.length > 0 && <section className="mx-auto max-w-[1600px] px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
        <h2 className="mb-9 text-3xl font-normal tracking-tight md:text-5xl">{t("shopFromCategories")}</h2>
        <div className="grid gap-5 sm:grid-cols-3">{categories.map(p => <Link key={p.categoryKey || p.category} href={{ pathname: "/products", query: { category: p.categoryKey || p.category } }} className="group relative isolate flex aspect-[4/5] items-end overflow-hidden rounded-xl bg-neutral-800 p-6 text-white">
          {p.image && <Image src={p.image} alt={p.category} fill sizes="(max-width: 640px) 100vw, 33vw" className="-z-20 object-cover transition-transform duration-500 motion-safe:group-hover:scale-105" />}
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/80 to-transparent" />
          <div className="flex w-full items-center justify-between gap-3"><h3 className="text-2xl">{p.category}</h3><ArrowUpRight className="h-6 w-6 shrink-0" /></div>
        </Link>)}</div>
      </section>}
      <HomeSelection products={products} />
      <section className="border-t border-neutral-200"><h2 className="px-5 pt-16 text-center text-3xl md:text-5xl">{c("confidence")}</h2><div className="mx-auto grid max-w-[1600px] gap-8 px-5 py-10 sm:grid-cols-3 sm:px-8 lg:px-12">{[{ icon: Truck, label: t("freeShipping") }, { icon: ShieldCheck, label: t("trustedWarranty") }, { icon: CreditCard, label: t("securePayment") }].map(({ icon: Icon, label }) => <div key={label} className="flex items-center gap-4"><Icon className="h-7 w-7 shrink-0 stroke-1" /><p className="text-sm">{label}</p></div>)}</div></section>
    </StoreMotion>
  );
}
