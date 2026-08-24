import { auth } from "@/lib/auth";
import { getTranslations } from "next-intl/server";
import NavbarClient, { type NavbarUser } from "@/components/NavbarClient";

const navKeys = ["home", "products", "about", "contact"] as const;

export default async function Navbar() {
  const session = await auth();
  const t = await getTranslations("Navigation");

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
      links={navKeys.map((key) => ({
        label: t(key),
        href: key === "home" ? "/" : `/${key}`,
      }))}
      labels={{
        brand: "Store",
        manageProducts: t("manageProducts"),
        profile: t("profile"),
        billing: t("billing"),
        settings: t("settings"),
        login: t("login"),
        register: t("register"),
        language: t("language"),
        search: t("search"),
      }}
    />
  );
}
