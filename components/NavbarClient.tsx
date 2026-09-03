"use client";

import { Link, usePathname } from "@/i18n/routing";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  Home,
  Heart,
  Info,
  Mail,
  Menu,
  Package,
  Search,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useWishlistStore } from "@/lib/store/useWishlistStore";

type NavLink = {
  label: string;
  href: string;
};

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

type NavbarClientProps = {
  user: NavbarUser | null;
  links: NavLink[];
  labels: NavbarLabels;
};

export default function NavbarClient({
  user,
  links,
  labels,
}: NavbarClientProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const isAdmin = user?.role === "admin";
  const allLinks = isAdmin
    ? [...links, { label: labels.manageProducts, href: "/admin/products" }]
    : links;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl supports-[backdrop-filter]:bg-white/80">
      <nav className="container mx-auto flex h-16 items-center gap-6 px-4 sm:px-6 lg:h-[4.5rem] lg:px-8">
        <div className="flex min-w-0 flex-1 items-center gap-2 lg:flex-none">
          <MobileMenu
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            setIsSearchOpen={setIsSearchOpen}
            links={allLinks}
            labels={labels}
            pathname={pathname}
            user={user}
          />
          <BrandLink brand={labels.brand} />
        </div>

        <div className="hidden min-w-0 flex-1 justify-center lg:flex">
          <div className="flex items-center gap-1 rounded-md border border-slate-200 bg-slate-50 p-1">
            {allLinks.map((link) => (
              <DesktopNavLink
                key={link.href}
                link={link}
                active={isActivePath(pathname, link.href)}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-1 items-center justify-end gap-1.5 sm:gap-2 lg:flex-none">
          <div className="hidden md:block">
            <LanguageSwitcher />
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="hidden h-10 w-10 rounded-md text-slate-700 hover:bg-slate-100 md:inline-flex"
            aria-label={labels.search}
            onClick={() => setIsSearchOpen(true)}
          >
            <Search className="h-5 w-5" />
          </Button>
          <NavbarWishlistLink label={labels.wishlist} />
          <ShopingCart />
          {user ? (
            <UserMenu user={user} labels={labels} />
          ) : (
            <AuthActions labels={labels} />
          )}
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

      <div className="hidden border-t border-slate-100 bg-white/70 px-3 py-2 backdrop-blur md:block lg:hidden">
        <div className="mx-auto flex max-w-7xl items-center gap-2 overflow-x-auto">
          {allLinks.map((link) => (
            <TabletNavLink
              key={link.href}
              link={link}
              active={isActivePath(pathname, link.href)}
            />
          ))}
        </div>
      </div>
    </header>
  );
}

function MobileMenu({
  isOpen,
  setIsOpen,
  setIsSearchOpen,
  links,
  labels,
  pathname,
  user,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  setIsSearchOpen: (open: boolean) => void;
  links: NavLink[];
  labels: NavbarLabels;
  pathname: string;
  user: NavbarUser | null;
}) {
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 shrink-0 rounded-md text-slate-700 hover:bg-slate-100 md:hidden"
          aria-label="Open navigation"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="flex w-[88vw] max-w-sm flex-col border-r border-slate-200 bg-white p-0"
      >
        <SheetHeader className="border-b border-slate-100 px-5 py-4 text-left">
          <SheetTitle className="flex items-center gap-2 text-lg font-bold text-slate-950">
            <BrandMark />
            {labels.brand}
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-1 flex-col gap-5 px-5 py-5">
          {user && (
            <div className="flex items-center gap-3 rounded-md border border-slate-200 bg-slate-50 p-3">
              <UserAvatar user={user} />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-950">
                  {user.name ?? labels.profile}
                </p>
                {user.email && (
                  <p className="truncate text-xs text-slate-500">
                    {user.email}
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="grid gap-1.5">
            {links.map((link) => (
              <MobileNavLink
                key={link.href}
                link={link}
                active={isActivePath(pathname, link.href)}
                onClick={() => setIsOpen(false)}
              />
            ))}
          </div>

          <div className="grid gap-3 border-t border-slate-100 pt-5">
            <div className="flex items-center justify-between gap-3 rounded-md border border-slate-200 bg-white px-3 py-2">
              <span className="text-sm font-medium text-slate-600">
                {labels.language}
              </span>
              <LanguageSwitcher />
            </div>
            <Button
              type="button"
              variant="outline"
              className="justify-start border-slate-200 bg-white text-slate-700"
              onClick={() => {
                setIsOpen(false);
                setTimeout(() => setIsSearchOpen(true), 150);
              }}
            >
              <Search className="h-4 w-4" />
              {labels.search}
            </Button>

            <Button
              variant="outline"
              asChild
              className="justify-start border-slate-200 bg-white text-slate-700"
            >
              <Link href="/wishlist" onClick={() => setIsOpen(false)}>
                <Heart className="h-4 w-4" />
                {labels.wishlist}
              </Link>
            </Button>
          </div>

          {!user && (
            <div className="mt-auto grid gap-2 border-t border-slate-100 pt-5">
              <Button variant="outline" asChild>
                <Link href="/login" onClick={() => setIsOpen(false)}>
                  {labels.login}
                </Link>
              </Button>
              <Button
                asChild
                className="bg-orange-500 text-white hover:bg-orange-600"
              >
                <Link href="/register" onClick={() => setIsOpen(false)}>
                  {labels.register}
                </Link>
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

function BrandLink({ brand }: { brand: string }) {
  return (
    <Link
      href="/"
      className="flex min-w-0 items-center gap-2.5 text-slate-950"
      aria-label={brand}
    >
      <BrandMark />
      <div className="min-w-0">
        <span className="block truncate text-lg font-bold tracking-normal sm:text-xl">
          {brand}
        </span>
      </div>
    </Link>
  );
}

function BrandMark() {
  return (
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-slate-950 text-white">
      <Sparkles className="h-4 w-4 text-orange-400" />
    </span>
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
      className="relative h-10 w-10 rounded-md text-slate-700 hover:bg-orange-50 hover:text-orange-600"
    >
      <Link href="/wishlist" aria-label={label}>
        <Heart className="h-5 w-5" />
        {mounted && count > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-orange-500 px-1 text-[10px] font-bold leading-none text-white ring-2 ring-white">
            {count > 9 ? "9+" : count}
          </span>
        )}
      </Link>
    </Button>
  );
}

function DesktopNavLink({ link, active }: { link: NavLink; active: boolean }) {
  const Icon = getNavIcon(link.href);

  return (
    <Link
      href={link.href}
      className={cn(
        "inline-flex h-10 items-center gap-2 rounded-md px-4 text-sm font-medium text-slate-600 transition-colors hover:bg-white hover:text-slate-950",
        active && "bg-white text-slate-950 shadow-xs",
      )}
    >
      <Icon className="h-4 w-4" />
      {link.label}
    </Link>
  );
}

function TabletNavLink({ link, active }: { link: NavLink; active: boolean }) {
  const Icon = getNavIcon(link.href);

  return (
    <Link
      href={link.href}
      className={cn(
        "inline-flex h-9 shrink-0 items-center gap-2 rounded-md px-3 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-950",
        active && "bg-slate-950 text-white hover:bg-slate-900 hover:text-white",
      )}
    >
      <Icon className="h-4 w-4" />
      {link.label}
    </Link>
  );
}

function MobileNavLink({
  link,
  active,
  onClick,
}: {
  link: NavLink;
  active: boolean;
  onClick: () => void;
}) {
  const Icon = getNavIcon(link.href);

  return (
    <Link
      href={link.href}
      onClick={onClick}
      className={cn(
        "flex h-12 items-center gap-3 rounded-md px-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-950",
        active && "bg-slate-950 text-white hover:bg-slate-900 hover:text-white",
      )}
    >
      <Icon className="h-4 w-4" />
      {link.label}
    </Link>
  );
}

function AuthActions({ labels }: { labels: NavbarLabels }) {
  return (
    <div className="hidden items-center gap-2 md:flex">
      <Button
        variant="outline"
        size="sm"
        asChild
        className="border-slate-200 bg-white"
      >
        <Link href="/login">{labels.login}</Link>
      </Button>
      <Button
        size="sm"
        asChild
        className="bg-orange-500 text-white hover:bg-orange-600"
      >
        <Link href="/register">{labels.register}</Link>
      </Button>
    </div>
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
        className="h-10 w-10 rounded-md border border-slate-200 bg-white p-0 hover:bg-slate-50"
          aria-label="Open account menu"
        >
          <UserAvatar user={user} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <div className="px-2 py-2">
          <div className="flex items-center gap-2 rounded-md bg-slate-50 p-2">
            <UserRound className="h-4 w-4 text-slate-500" />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-900">
                {user.name ?? labels.profile}
              </p>
              {user.email && (
                <p className="truncate text-xs text-slate-500">{user.email}</p>
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

function UserAvatar({ user }: { user: NavbarUser }) {
  const fallback = user.name?.charAt(0) || user.email?.charAt(0) || "U";

  return (
    <Avatar className="h-8 w-8">
      <AvatarImage src={user.image ?? ""} alt={user.name ?? ""} />
      <AvatarFallback className="bg-slate-100 text-sm font-semibold text-slate-700">
        {fallback.toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
}

function getNavIcon(href: string) {
  if (href === "/") return Home;
  if (href.startsWith("/products")) return Package;
  if (href.startsWith("/about")) return Info;
  if (href.startsWith("/contact")) return Mail;
  if (href.startsWith("/admin")) return ShieldCheck;
  return Sparkles;
}

function isActivePath(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}
