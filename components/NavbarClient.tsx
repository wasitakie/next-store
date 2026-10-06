"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SignOutButton } from "@/components/Button";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import ShopingCart from "@/components/ShopingCart";
import SearchDialog from "@/components/Search";
import { cn } from "@/lib/utils";
import {
  Asterisk,
  ChevronDown,
  ChevronRight,
  Heart,
  Menu,
  Search,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";
import { useWishlistStore } from "@/lib/store/useWishlistStore";
import { LocalizedProduct } from "@/types/product";

type NavLink = { label: string; href: string };
type NavbarLabels = {
  brand: string;
  manageProducts: string;
  profile: string;
  billing: string;
  settings: string;
  login: string;
  register: string;
  language: string;
  wishlist: string;
  search: string;
  searchTitle: string;
  searchDescription: string;
  searchPlaceholder: string;
  searchSubmit: string;
  searchPopularTitle: string;
  searchEmptyHint: string;
  searchClose: string;
  searchSuggestions: string[];
};
export type NavbarUser = {
  name: string | null;
  email: string | null;
  image: string | null;
  role: "user" | "admin";
};
type NavCategory = { key: string; name: string; image: string | null };
type NavbarClientProps = {
  user: NavbarUser | null;
  links: NavLink[];
  labels: NavbarLabels;
  categories: NavCategory[];
  popularProducts: LocalizedProduct[];
};
const iconButtonClass =
  "size-9 shrink-0 rounded-full p-0 text-inherit hover:bg-transparent hover:text-inherit hover:opacity-70 [&_svg]:size-[22px]";

export default function NavbarClient({
  user,
  links,
  labels,
  categories,
  popularProducts,
}: NavbarClientProps) {
  const pathname = usePathname();
  const t = useTranslations("Navigation");
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const overHero = pathname === "/" || pathname === "/products";
  // The logo links home; keep the main navigation as a compact shop menu.
  const allLinks = links
    .filter((link) => link.href !== "/")
    .map((link) =>
      link.href === "/products" ? { ...link, label: t("shop") } : link,
    );
  if (user?.role === "admin")
    allLinks.push({ label: labels.manageProducts, href: "/admin/products" });

  return (
    <header
      className={cn(
        "z-40 w-full",
        overHero
          ? "absolute left-0 bg-gradient-to-b from-black/25 to-transparent text-white"
          : "relative bg-white text-neutral-950",
      )}
    >
      <AnnouncementBar />
      <nav
        aria-label={t("mainNavigation")}
        className="mx-auto flex h-[88px] max-w-[1600px] items-center justify-between gap-2 px-5 md:h-[100px] md:px-8 lg:gap-6 xl:gap-10 xl:px-12"
      >
        <BrandLink brand={labels.brand} />
        <div className="hidden flex-1 items-center gap-6 lg:flex xl:gap-9 xl:pl-16">
          {allLinks.map((link) =>
            link.href === "/products" ? (
              <ShopMenu
                key={link.href}
                label={link.label}
                categories={categories}
              />
            ) : (
              <Link
                key={link.href}
                href={link.href}
                aria-current={pathname === link.href ? "page" : undefined}
                className="whitespace-nowrap text-base font-normal uppercase transition-opacity hover:opacity-60"
              >
                {link.label}
              </Link>
            ),
          )}
        </div>
        <div className="flex shrink-0 items-center gap-0 min-[360px]:gap-1 lg:gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={iconButtonClass}
            aria-label={labels.search}
            onClick={() => setIsSearchOpen(true)}
          >
            <Search strokeWidth={1.25} />
          </Button>
          {user ? (
            <UserMenu user={user} labels={labels} />
          ) : (
            <Button
              variant="ghost"
              size="icon"
              asChild
              className={iconButtonClass}
            >
              <Link href="/login" aria-label={labels.login}>
                <UserRound strokeWidth={1.25} />
              </Link>
            </Button>
          )}
          <div className="hidden lg:block">
            <NavbarWishlistLink label={labels.wishlist} />
          </div>
          <ShopingCart popularProducts={popularProducts} />
          <div className="ml-1 hidden lg:block">
            <LanguageSwitcher compact />
          </div>
          <MobileMenu
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            links={allLinks}
            labels={labels}
            categories={categories}
            showRegister={!user}
          />
        </div>
      </nav>
      <SearchDialog
        open={isSearchOpen}
        onOpenChange={setIsSearchOpen}
        labels={{
          title: labels.searchTitle,
          description: labels.searchDescription,
          placeholder: labels.searchPlaceholder,
          submit: labels.searchSubmit,
          popularTitle: labels.searchPopularTitle,
          emptyHint: labels.searchEmptyHint,
          close: labels.searchClose,
          suggestions: labels.searchSuggestions,
        }}
      />
    </header>
  );
}

function AnnouncementBar() {
  const t = useTranslations("Storefront");
  const home = useTranslations("HomePage");
  return (
    <div className="h-8 overflow-hidden bg-[#1a1a1a] text-white">
      <p className="sr-only">
        {t("announcement")} · {home("freeShipping")}
      </p>
      <div
        aria-hidden="true"
        className="store-announcement flex w-max min-w-full items-center"
      >
        {[0, 1].map((copy) => (
          <div key={copy} className="flex h-8 shrink-0 items-center">
            {[0, 1, 2].map((index) => (
              <div
                key={index}
                className="flex items-center text-[11px] font-normal uppercase sm:text-xs"
              >
                <span className="w-[190px] text-center sm:w-[240px]">
                  {t("announcement")}
                </span>
                <span className="w-[190px] text-center sm:w-[240px]">
                  {home("freeShipping")}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function BrandLink({ brand }: { brand: string }) {
  return (
    <Link
      href="/"
      aria-label={brand}
      className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap text-xl font-medium leading-none tracking-tighter min-[360px]:text-[26px] md:text-[30px]"
    >
      NextStore{" "}
      <Asterisk
        aria-hidden="true"
        className="size-6 md:size-8"
        strokeWidth={3}
      />
    </Link>
  );
}

function ShopMenu({
  label,
  categories,
}: {
  label: string;
  categories: NavCategory[];
}) {
  const t = useTranslations("Navigation");
  const [open, setOpen] = useState(false);
  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={(event) => {
        if (!event.currentTarget.contains(document.activeElement))
          setOpen(false);
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape") setOpen(false);
      }}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls="shop-navigation"
        onClick={() => setOpen(true)}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown") {
            event.preventDefault();
            setOpen(true);
          }
        }}
        className="inline-flex h-10 items-center gap-2 text-base font-normal uppercase underline-offset-8 outline-offset-4 hover:underline"
      >
        {label}
        <ChevronDown
          className={cn("size-4 transition-transform", open && "rotate-180")}
          strokeWidth={1}
        />
      </button>
      {open && (
        <div
          id="shop-navigation"
          className="absolute -left-7 top-full z-50 w-[min(1040px,calc(100vw-20rem))] pt-5"
        >
          <div className="grid grid-cols-[180px_1fr] gap-8 rounded-xl border border-neutral-100 bg-white p-8 text-neutral-950 shadow-sm xl:grid-cols-[240px_1fr]">
            <div>
              <p className="mb-4 text-xs uppercase text-neutral-500">
                {t("categories")}
              </p>
              <div className="flex flex-col items-start gap-4">
                <Link
                  href="/products"
                  onClick={() => setOpen(false)}
                  className="text-sm hover:underline"
                >
                  {t("allProducts")}
                </Link>
                {categories.slice(0, 6).map((category) => (
                  <Link
                    key={category.key}
                    href={{
                      pathname: "/products",
                      query: { category: category.key },
                    }}
                    onClick={() => setOpen(false)}
                    className="text-sm hover:underline"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-4 text-xs uppercase text-neutral-500">
                {t("shopCollections")}
              </p>
              <div className="grid grid-cols-4 gap-4">
                {categories
                  .filter((category) => category.image)
                  .slice(0, 4)
                  .map((category) => (
                    <Link
                      key={category.key}
                      href={{
                        pathname: "/products",
                        query: { category: category.key },
                      }}
                      onClick={() => setOpen(false)}
                      className="group min-w-0 text-center text-sm"
                    >
                      <div className="relative mb-3 aspect-[4/5] overflow-hidden rounded-lg bg-neutral-100">
                        <Image
                          src={category.image!}
                          alt={category.name}
                          fill
                          sizes="180px"
                          className="object-cover transition-transform group-hover:scale-105"
                        />
                      </div>
                      {category.name}
                    </Link>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MobileMenu({
  isOpen,
  setIsOpen,
  links,
  labels,
  categories,
  showRegister,
}: {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  links: NavLink[];
  labels: NavbarLabels;
  categories: NavCategory[];
  showRegister: boolean;
}) {
  const t = useTranslations("Navigation");
  const mobileLinks = [
    ...links.filter((link) => link.href !== "/contact"),
    { label: labels.wishlist, href: "/wishlist" },
    ...links.filter((link) => link.href === "/contact"),
  ];
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(iconButtonClass, "lg:hidden [&_svg]:size-7")}
          aria-label={t("openMenu")}
        >
          <Menu strokeWidth={1.25} />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        overlayClassName="top-8"
        aria-describedby={undefined}
        className="top-8 flex h-[calc(100dvh-2rem)] w-full max-w-none flex-col gap-0 overflow-y-auto border-0 bg-white p-0 text-neutral-950 sm:max-w-none [&>button:last-child]:hidden"
      >
        <SheetHeader className="flex h-[88px] shrink-0 flex-row items-center justify-between space-y-0 px-5 md:h-[100px] md:px-8">
          <SheetTitle className="text-neutral-950">
            <span onClick={() => setIsOpen(false)}>
              <BrandLink brand={labels.brand} />
            </span>
          </SheetTitle>
          <SheetClose asChild>
            <Button
              variant="ghost"
              size="icon"
              className={iconButtonClass}
              aria-label={t("closeMenu")}
            >
              <X strokeWidth={1.25} />
            </Button>
          </SheetClose>
        </SheetHeader>
        <nav aria-label={t("mainNavigation")} className="px-5 py-2 md:px-8">
          {mobileLinks.map((link) =>
            link.href === "/products" ? (
              <details
                key={link.href}
                className="group border-b border-neutral-200"
              >
                <summary className="flex min-h-[68px] cursor-pointer list-none items-center justify-between py-4 text-2xl">
                  {link.label}
                  <ChevronRight
                    className="size-6 text-neutral-500 transition-transform group-open:rotate-90"
                    strokeWidth={1}
                  />
                </summary>
                <div className="flex flex-col gap-5 pb-6 pl-3 text-base">
                  <Link href="/products" onClick={() => setIsOpen(false)}>
                    {t("allProducts")}
                  </Link>
                  {categories.map((category) => (
                    <Link
                      key={category.key}
                      href={{
                        pathname: "/products",
                        query: { category: category.key },
                      }}
                      onClick={() => setIsOpen(false)}
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              </details>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="flex min-h-[68px] items-center justify-between border-b border-neutral-200 py-4 text-2xl font-normal hover:text-neutral-500"
              >
                {link.label}
              </Link>
            ),
          )}
        </nav>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-4 border-t border-neutral-200 px-5 py-5 text-sm md:px-8">
          <span className="text-neutral-500">{labels.language}</span>
          <LanguageSwitcher />
          {showRegister && (
            <Link
              href="/register"
              onClick={() => setIsOpen(false)}
              className="w-full text-neutral-500 underline underline-offset-4"
            >
              {labels.register}
            </Link>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

function NavbarWishlistLink({ label }: { label: string }) {
  const [mounted, setMounted] = useState(false);
  const count = useWishlistStore((state) => state.items.length);
  useEffect(() => {
    setMounted(true);
  }, []);
  return (
    <Button
      variant="ghost"
      size="icon"
      asChild
      className={cn(iconButtonClass, "relative")}
    >
      <Link href="/wishlist" aria-label={label}>
        <Heart strokeWidth={1.25} />
        <span className="absolute right-0 top-0 flex size-3.5 items-center justify-center rounded-full bg-white text-[9px] leading-none text-neutral-950">
          {mounted ? (count > 9 ? "9+" : count) : 0}
        </span>
      </Link>
    </Button>
  );
}

function UserMenu({
  user,
  labels,
}: {
  user: NavbarUser;
  labels: NavbarLabels;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={iconButtonClass}
          aria-label={labels.profile}
        >
          <UserRound className="size-[22px]" strokeWidth={1.25} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <div className="px-2 py-2">
          <div className="flex items-center gap-2 rounded-md bg-neutral-50 p-2">
            <UserRound className="h-4 w-4 text-neutral-500" />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-neutral-900">
                {user.name ?? labels.profile}
              </p>
              {user.email && (
                <p className="truncate text-xs text-neutral-500">
                  {user.email}
                </p>
              )}
            </div>
          </div>
        </div>
        <DropdownMenuGroup>
          <DropdownMenuItem>{labels.profile}</DropdownMenuItem>
          <DropdownMenuItem>{labels.billing}</DropdownMenuItem>
          <DropdownMenuItem>{labels.settings}</DropdownMenuItem>
          {user.role === "admin" && (
            <DropdownMenuItem asChild>
              <Link href="/admin/products">
                <ShieldCheck className="mr-2 h-4 w-4" />
                {labels.manageProducts}
              </Link>
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <SignOutButton />
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
