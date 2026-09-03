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
    <div className="flex h-full flex-col space-y-4 border-r border-slate-200 bg-white py-4 text-slate-700">
      <div className="px-3 py-2 flex-1">
        <Link href="/admin" className="flex items-center pl-3 mb-14">
          <div className="relative mr-4 flex h-8 w-8 items-center justify-center rounded-md bg-slate-950">
            <Store className="h-5 w-5 text-orange-400" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-950">
            {t("adminTitle")}
          </h1>
        </Link>
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "group flex w-full cursor-pointer justify-start rounded-md p-3 text-sm font-medium transition hover:bg-slate-100 hover:text-slate-950",
                pathname === route.href ||
                  (pathname.startsWith(route.href) && route.href !== "/admin")
                  ? "bg-slate-950 text-white hover:bg-slate-900 hover:text-white"
                  : "text-slate-500",
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon
                  className={cn(
                    "h-5 w-5 mr-3",
                    pathname === route.href ||
                      (pathname.startsWith(route.href) &&
                        route.href !== "/admin")
                      ? "text-orange-300"
                      : "",
                  )}
                />
                {route.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div className="mt-auto border-t border-slate-200 px-3 py-4">
        <Link
          href="/"
          className="group flex w-full cursor-pointer justify-start rounded-md p-3 text-sm font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-950"
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
