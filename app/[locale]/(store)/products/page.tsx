import ProductSection from "@/components/ProductSection";
import React from "react";
import { prisma } from "@/lib/prisma";
import { localizeProduct } from "@/lib/utils";

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
