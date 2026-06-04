import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const handleI18nRouting = createMiddleware(routing);

export async function proxy(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // Skip applying next-intl middleware to API routes
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // Apply next-intl middleware
  const res = handleI18nRouting(req);

  // Custom Auth logic for /admin
  const isLocaleAdminPath = routing.locales.some(locale => pathname.startsWith(`/${locale}/admin`)) || pathname.startsWith("/admin");

  if (!isLocaleAdminPath) {
    return res;
  }

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET,
  });

  const localeSegment = pathname.split('/')[1];
  const locale = routing.locales.includes(localeSegment as typeof routing.locales[number]) ? localeSegment : routing.defaultLocale;

  if (!token) {
    return NextResponse.redirect(new URL(`/${locale}/login`, req.url));
  }

  if (token.role !== "admin") {
    return NextResponse.redirect(new URL(`/${locale}/`, req.url));
  }

  return res;
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
