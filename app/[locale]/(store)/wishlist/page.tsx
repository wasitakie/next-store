import StoreMotion from "@/components/storefront/StoreMotion";
import { prisma } from "@/lib/prisma";
import { localizeProduct } from "@/lib/utils";
import { getTranslations } from "next-intl/server";
import EditorialHero, { editorialImages } from "@/components/storefront/EditorialHero";
import WishlistContent from "@/components/storefront/WishlistContent";

export default async function WishlistPage({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  const t = await getTranslations("EcomPages");
  const products = (await prisma.product.findMany()).map(p => localizeProduct(p,locale));
  return <StoreMotion className="bg-white text-neutral-950"><EditorialHero centered title={t("favorites")} description={t("favoritesIntro")} image={editorialImages.headphones} /><WishlistContent products={products} /></StoreMotion>;
}
