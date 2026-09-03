import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin/",
        "/en/admin/",
        "/th/admin/",
        "/cart",
        "/en/cart",
        "/th/cart",
        "/checkout",
        "/en/checkout",
        "/th/checkout",
        "/login",
        "/en/login",
        "/th/login",
        "/register",
        "/en/register",
        "/th/register",
        "/order-success/",
        "/en/order-success/",
        "/th/order-success/",
        "/api/",
      ],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
