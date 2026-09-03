import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { absoluteUrl } from "@/lib/seo";
import { routing } from "@/i18n/routing";

const publicPaths = ["/", "/products"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries = routing.locales.flatMap((locale) =>
    publicPaths.map((path) => ({
      url: absoluteUrl(`/${locale}${path}`),
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: path === "/" ? 1 : 0.9,
      alternates: {
        languages: {
          th: absoluteUrl(`/th${path}`),
          en: absoluteUrl(`/en${path}`),
        },
      },
    })),
  );

  let products: Array<{ slug: string; updatedAt: Date; image: string | null }> =
    [];

  try {
    products = await prisma.product.findMany({
      select: {
        slug: true,
        updatedAt: true,
        image: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
  } catch (error) {
    console.warn("Failed to load product URLs for sitemap", error);
  }

  const productEntries = products.flatMap((product) =>
    routing.locales.map((locale) => ({
      url: absoluteUrl(`/${locale}/products/${product.slug}`),
      lastModified: product.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
      images: product.image ? [product.image] : undefined,
      alternates: {
        languages: {
          th: absoluteUrl(`/th/products/${product.slug}`),
          en: absoluteUrl(`/en/products/${product.slug}`),
        },
      },
    })),
  );

  return [...staticEntries, ...productEntries];
}
