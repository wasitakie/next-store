import { LocalizedProduct } from "@/types/product";
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { Product as PrismaProduct } from "@prisma/client";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function localizeProduct(product: PrismaProduct, locale: string): LocalizedProduct {
  return {
    ...product,
    name: locale === "en" ? product.name_en || "" : product.name_th || "",
    description: locale === "en" ? product.description_en || "": product.description_th || "",
    category: locale === "en" ? product.category_en || ""  : product.category_th || "",
  };
}
