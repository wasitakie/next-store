import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Search as SearchIcon, ShoppingBag, ShoppingCart } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { auth } from "@/lib/auth";
import { SignoutButton } from "@/components/Button";
import { getTranslations } from "next-intl/server";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default async function Navbar() {
  const session = await auth();
  const isAdmin = session?.user?.role === "admin";
  const t = await getTranslations("Navigation");

  return (
    <>
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-indigo-600">NextStore</h1>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link
                href="/"
                className="text-gray-900 hover:text-indigo-600 transition-colors"
              >
                {t("home")}
              </Link>
              <Link
                href="/products"
                className="text-gray-900 hover:text-indigo-600 transition-colors"
              >
                {t("products")}
              </Link>
              <Link
                href="/about"
                className="text-gray-900 hover:text-indigo-600 transition-colors"
              >
                {t("about")}
              </Link>
              <Link
                href="/contact"
                className="text-gray-900 hover:text-indigo-600 transition-colors"
              >
                {t("contact")}
              </Link>
              {isAdmin && (
                <Link
                  href="/admin/products"
                  className="text-gray-900 hover:text-indigo-600 transition-colors"
                >
                  {t("manageProducts")}
                </Link>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <LanguageSwitcher />
              <Button variant="ghost" size="sm">
                <SearchIcon className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm">
                <ShoppingBag className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm" asChild>
                {session?.user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full"
                      >
                        <Avatar>
                          <AvatarImage
                            src={session?.user?.image || ""}
                            alt={session?.user?.name || ""}
                          />
                          <AvatarFallback>
                            {session?.user?.name?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                      <DropdownMenuGroup>
                        <DropdownMenuItem>{t("profile")}</DropdownMenuItem>
                        <DropdownMenuItem>{t("billing")}</DropdownMenuItem>
                        <DropdownMenuItem>{t("settings")}</DropdownMenuItem>
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <SignoutButton />
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <>
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/login">{t("login")}</Link>
                    </Button>
                    <Button size="sm" asChild>
                      <Link href="/register">{t("register")}</Link>
                    </Button>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
