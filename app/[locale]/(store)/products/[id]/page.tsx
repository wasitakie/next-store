import { prisma } from "@/lib/prisma";
import { Truck, ShieldCheck, ImageIcon, Plus } from "lucide-react";
import { getTranslations, getFormatter } from "next-intl/server";
import ProductCard from "@/components/ProductCard";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { notFound } from "next/navigation";
import { localizeProduct } from "@/lib/utils";
import AddToCartButton from "@/components/AddToCartButton";
import WishlistButton from "@/components/WishlistButton";
import JsonLd from "@/components/JsonLd";
import { absoluteUrl, buildSeoMetadata } from "@/lib/seo";
import type { Metadata } from "next";

function productWhere(identifier: string) {
  const numericId = Number(identifier);

  return Number.isInteger(numericId)
    ? { OR: [{ id: numericId }, { slug: identifier }] }
    : { slug: identifier };
}

async function getRelatedProducts(category: string, currentId: number) {
  const products = await prisma.product.findMany({
    where: {
      OR: [{ category_th: category }, { category_en: category }],
      id: { not: currentId },
    },
    take: 4,
    orderBy: { createdAt: "desc" },
  });
  return products;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { locale, id } = await params;
  const product = await prisma.product.findFirst({
    where: productWhere(id),
  });

  if (!product) {
    return {};
  }

  const localizedProduct = localizeProduct(product, locale);
  const fallbackDescription =
    locale === "en"
      ? "Quality tech product from NextStore with trusted delivery and warranty."
      : "สินค้าเทคโนโลยีคุณภาพจาก NextStore พร้อมจัดส่งและรับประกันอุ่นใจ";

  return buildSeoMetadata({
    locale,
    path: `/products/${product.slug}`,
    title: `${localizedProduct.name} | NextStore`,
    description: localizedProduct.description || fallbackDescription,
    image: product.image,
    type: "article",
  });
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const rawProduct = await prisma.product.findFirst({
    where: productWhere(id),
  });

  if (!rawProduct) {
    notFound();
  }

  const t = await getTranslations("ProductDetail");
  const e = await getTranslations("Storefront");
  const home = await getTranslations("HomePage");
  const format = await getFormatter();
  const product = localizeProduct(rawProduct, locale);
  const relatedProducts = await getRelatedProducts(
    product.category,
    product.id,
  );
  const localizedRelatedProducts = relatedProducts.map((p) =>
    localizeProduct(p, locale),
  );
  const productUrl = absoluteUrl(`/${locale}/products/${rawProduct.slug}`);
  const productImage = rawProduct.image?.startsWith("http")
    ? rawProduct.image
    : rawProduct.image
      ? absoluteUrl(rawProduct.image)
      : undefined;
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description:
      product.description ||
      (locale === "en"
        ? "Quality tech product from NextStore."
        : "สินค้าเทคโนโลยีคุณภาพจาก NextStore"),
    image: productImage ? [productImage] : undefined,
    sku: String(product.id),
    category: product.category || undefined,
    url: productUrl,
    offers: {
      "@type": "Offer",
      url: productUrl,
      priceCurrency: "THB",
      price: product.price.toFixed(2),
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: {
        "@type": "Organization",
        name: "NextStore",
      },
    },
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: locale === "en" ? "Home" : "หน้าแรก",
        item: absoluteUrl(`/${locale}`),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: locale === "en" ? "Products" : "สินค้าทั้งหมด",
        item: absoluteUrl(`/${locale}/products`),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.name,
        item: productUrl,
      },
    ],
  };

  return (
    <main className="mx-auto max-w-[1600px] px-5 pb-16 sm:px-8 lg:px-12">
      <JsonLd data={productJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      <nav aria-label={t("breadcrumbAllProducts")} className="flex flex-wrap items-center gap-2 py-6 text-xs text-neutral-500">
        <Link href="/" className="hover:text-black">{t("breadcrumbHome")}</Link><span>/</span>
        <Link href="/products" className="hover:text-black">{t("breadcrumbAllProducts")}</Link><span>/</span>
        <span className="text-neutral-950">{product.name}</span>
      </nav>
      <div className="grid items-start gap-8 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
        <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-neutral-100">
          {product.image ? <Image src={product.image} alt={product.name} fill priority sizes="(max-width: 1024px) 100vw, 55vw" className="object-cover" /> : <div className="flex h-full items-center justify-center"><ImageIcon className="h-20 w-20 text-neutral-400" /></div>}
        </div>
        <div className="lg:sticky lg:top-8">
          <p className="mb-3 text-xs uppercase tracking-widest text-neutral-500">{product.category}</p>
          <h1 className="text-3xl font-normal leading-tight tracking-tight sm:text-4xl lg:text-5xl">{product.name}</h1>
          <p className="mt-5 text-2xl">{format.number(product.price, "currency")}</p>
          <p className="mt-4 text-sm text-neutral-500">{product.stock > 0 ? t("inStock") : t("outOfStock")}</p>
          {product.description && <p className="mt-6 whitespace-pre-line text-sm leading-7 text-neutral-600">{product.description}</p>}
          <div className="my-8 flex flex-wrap gap-3">
            <AddToCartButton product={product} />
            <WishlistButton product={product} label={t("save")} activeLabel={e("saved")} showLabel size="lg" className="h-12 rounded-full border-neutral-300 text-neutral-950" />
          </div>
          <div className="grid gap-4 border-y border-neutral-200 py-6 text-sm">
            <p className="flex items-center gap-3"><Truck className="h-5 w-5 stroke-1" />{home("freeShipping")}</p>
            <p className="flex items-center gap-3"><ShieldCheck className="h-5 w-5 stroke-1" />{home("trustedWarranty")}</p>
          </div>
          <details className="group border-b border-neutral-200 py-5" open>
            <summary className="flex cursor-pointer list-none items-center justify-between text-sm">{t("descriptionTitle")}<Plus className="h-4 w-4 transition-transform group-open:rotate-45" /></summary>
            <p className="mt-4 whitespace-pre-line text-sm leading-7 text-neutral-500">{product.description || product.name}</p>
          </details>
          <details className="group border-b border-neutral-200 py-5">
            <summary className="flex cursor-pointer list-none items-center justify-between text-sm">{e("delivery")}<Plus className="h-4 w-4 transition-transform group-open:rotate-45" /></summary>
            <Link href="/contact" className="mt-4 inline-block text-sm underline underline-offset-4">{home("trustedWarranty")}</Link>
          </details>
        </div>
      </div>
      {localizedRelatedProducts.length > 0 && <section className="mt-20 lg:mt-28"><h2 className="mb-9 text-3xl font-normal tracking-tight md:text-4xl">{t("relatedProducts")}</h2><ProductCard products={localizedRelatedProducts} /></section>}
    </main>
  );
}
