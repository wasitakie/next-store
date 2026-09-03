import { prisma } from "@/lib/prisma";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Share2, Star, Truck } from "lucide-react";
import Link from "next/link";
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
    <div className="min-h-screen bg-background">
      <JsonLd data={productJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex mb-8 text-sm">
          <Link href="/" className="text-gray-600 hover:text-gray-900">
            หน้าแรก
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <Link href="/products" className="text-gray-600 hover:text-gray-900">
            สินค้าทั้งหมด
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-900">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div>
            <Card className="overflow-hidden border-slate-200 shadow-none">
              <div className="aspect-square bg-gray-100 flex items-center justify-center">
                {product.image ? (
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={600}
                    height={600}
                    priority
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-32 h-32 text-gray-400">
                    <svg
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      className="w-full h-full"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              {product.category && (
                <Badge variant="secondary" className="mb-2">
                  {product.category}
                </Badge>
              )}
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${i < 4 ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                    />
                  ))}
                  <span className="ml-2 text-sm text-gray-600">(4.5)</span>
                </div>
                <span className="text-sm text-gray-600">
                  ขายแล้ว {Math.floor(Math.random() * 100) + 10} ชิ้น
                </span>
              </div>
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-3xl font-bold text-primary">
                  ฿{product.price.toLocaleString()}
                </span>
                {product.stock > 0 ? (
                  <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50">
                    มีสินค้า
                  </Badge>
                ) : (
                  <Badge variant="destructive">สินค้าหมด</Badge>
                )}
              </div>
            </div>

            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Truck className="w-4 h-4" />
                    <span>จัดส่งฟรีเมื่อซื้อ ฿500 ขึ้นไป</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m0 0l-2-2m2 2l-2-2m6 0a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2z"
                      />
                    </svg>
                    <span>รับประกันสินค้า 7 วัน</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex gap-3">
              <AddToCartButton product={product} />
              <WishlistButton
                product={product}
                label="บันทึก"
                activeLabel="บันทึกแล้ว"
                showLabel
                size="lg"
              />
              <Button variant="outline" size="lg">
                <Share2 className="w-5 h-5 mr-2" />
                แชร์
              </Button>
            </div>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>รายละเอียดสินค้า</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  {product.description ||
                    "สินค้าคุณภาพดี ผลิตจากวัตถุดิบคุณภาพ เหมาะสำหรับการใช้งานในชีวิตประจำวัน รับประกันความพึงพอใจ 100%"}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Related Products */}
        {localizedRelatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              สินค้าที่เกี่ยวข้อง
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {localizedRelatedProducts.map((relatedProduct) => (
                <Card key={relatedProduct.id} className="group border-slate-200">
                  <CardHeader className="p-0">
                    <div className="flex aspect-square items-center justify-center overflow-hidden rounded-t-md bg-slate-100">
                      {relatedProduct.image ? (
                        <Image
                          src={relatedProduct.image}
                          alt={relatedProduct.name}
                          width={300}
                          height={300}
                          className="h-full w-full object-cover transition-transform group-hover:scale-[1.03]"
                        />
                      ) : (
                        <div className="w-16 h-16 text-gray-400">
                          <svg
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            className="w-full h-full"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <CardTitle className="text-sm font-medium mb-2 line-clamp-2">
                      {relatedProduct.name}
                    </CardTitle>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-primary">
                        ฿{relatedProduct.price.toLocaleString()}
                      </span>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/products/${relatedProduct.slug}`}>ดู</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
