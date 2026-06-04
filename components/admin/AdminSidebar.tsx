"use client";

import { Link } from "@/i18n/routing";
import { usePathname } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Package, ShoppingCart, Store } from "lucide-react";
import { useTranslations } from "next-intl";

export default function AdminSidebar() {
  const pathname = usePathname();
  const t = useTranslations("Admin");

  const routes = [
    {
      label: t("dashboard"),
      icon: LayoutDashboard,
      href: "/admin",
    },
    {
      label: t("products"),
      icon: Package,
      href: "/admin/products",
    },
    {
      label: t("orders"),
      icon: ShoppingCart,
      href: "/admin/orders",
    },
  ];

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-gray-900 text-white shadow-xl">
      <div className="px-3 py-2 flex-1">
        <Link href="/admin" className="flex items-center pl-3 mb-14">
          <div className="relative w-8 h-8 mr-4 bg-indigo-500 rounded-lg flex items-center justify-center">
            <Store className="text-white w-5 h-5" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            {t("adminTitle")}
          </h1>
        </Link>
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
                pathname === route.href ||
                  (pathname.startsWith(route.href) && route.href !== "/admin")
                  ? "text-white bg-white/10"
                  : "text-zinc-400",
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon
                  className={cn(
                    "h-5 w-5 mr-3",
                    pathname === route.href ||
                      (pathname.startsWith(route.href) &&
                        route.href !== "/admin")
                      ? "text-indigo-400"
                      : "",
                  )}
                />
                {route.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div className="px-3 py-4 mt-auto border-t border-gray-800">
        <Link
          href="/"
          className="text-sm group flex p-3 w-full justify-start font-medium cursor-pointer text-zinc-400 hover:text-white hover:bg-white/10 rounded-lg transition"
        >
          <div className="flex items-center flex-1">
            <Store className="h-5 w-5 mr-3" />
            {t("backToStore")}
          </div>
        </Link>
      </div>
    </div>
  );
}
