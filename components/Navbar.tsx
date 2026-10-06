import { localizeProduct } from "@/lib/utils";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import NavbarClient, { type NavbarUser } from "@/components/NavbarClient";

const navKeys = ["home", "products", "about", "contact"] as const;

export default async function Navbar() {
  const session = await auth();
  const t = await getTranslations("Navigation");
  const locale = await getLocale();
  const products = await prisma.product.findMany({
    select: { category_en: true, category_th: true, image: true },
    orderBy: { createdAt: "desc" },
  });
  const categories = [...new Map(products.flatMap(product => {
    const key = product.category_en || product.category_th;
    if (!key) return [];
    const name = (locale === "en" ? product.category_en : product.category_th) || key;
    return [[key, { key, name, image: product.image }] as const];
  })).values()];

  const popularProducts = (await prisma.product.findMany({
    where: { stock: { gt: 0 } },
    orderBy: [{ orderItems: { _count: "desc" } }, { createdAt: "desc" }, { id: "asc" }],
    take: 8,
  })).map(product => localizeProduct(product, locale));

  const user: NavbarUser | null = session?.user
    ? {
        name: session.user.name ?? null,
        email: session.user.email ?? null,
        image: session.user.image ?? null,
        role: session.user.role === "admin" ? "admin" : "user",
      }
    : null;

  return (
    <NavbarClient
      user={user}
      categories={categories}
      popularProducts={popularProducts}
      links={navKeys.map((key) => ({
        label: t(key),
        href: key === "home" ? "/" : `/${key}`,
      }))}
      labels={{
        brand: "NextStore",
        manageProducts: t("manageProducts"),
        profile: t("profile"),
        billing: t("billing"),
        settings: t("settings"),
        wishlist: t("wishlist"),
        login: t("login"),
        register: t("register"),
        language: t("language"),
        search: t("search"),
        searchTitle: t("searchTitle"),
        searchDescription: t("searchDescription"),
        searchPlaceholder: t("searchPlaceholder"),
        searchSubmit: t("searchSubmit"),
        searchPopularTitle: t("searchPopularTitle"),
        searchEmptyHint: t("searchEmptyHint"),
        searchClose: t("searchClose"),
        searchSuggestions: [
          t("searchSuggestionLaptop"),
          t("searchSuggestionHeadphone"),
          t("searchSuggestionKeyboard"),
          t("searchSuggestionMouse"),
        ],
      }}
    />
  );
}
