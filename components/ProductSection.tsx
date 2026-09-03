"use client";
import { useState, useMemo } from "react";
import ProductCard from "@/components/ProductCard";
import ProductFilters from "@/components/ProductFilters";
import { LocalizedProduct } from "@/types/product";
import { Button } from "./ui/button";
import {
  PackageSearch,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  X,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { EmptyState } from "@/components/ui/state";

interface ProductSectionProps {
  products: LocalizedProduct[];
  categories?: LocalizedProduct[];
}

export default function ProductSection({
  products,
  categories,
}: ProductSectionProps) {
  const [filterOpen, setFilterOpen] = useState(true);
  const t = useTranslations("ProductFilters");
  const router = useRouter();
  const searchParams = useSearchParams();

  // Parse search params for filtering
  const category = searchParams.get("category") || "";
  const query = searchParams.get("q")?.trim() || "";
  const minPrice = Number(searchParams.get("minPrice")) || 0;
  const maxPrice = Number(searchParams.get("maxPrice")) || Infinity;
  const stockOnly = searchParams.get("stock") === "true";
  const sort = searchParams.get("sort") || "newest";

  // Filter and sort products client-side
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Filter by Category
    if (query) {
      const normalizedQuery = query.toLowerCase();
      result = result.filter((p) =>
        [p.name, p.category, p.description]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(normalizedQuery)),
      );
    }

    if (category) {
      result = result.filter(
        (p) => p.category?.toLowerCase() === category.toLowerCase(),
      );
    }

    // Filter by Price Range
    result = result.filter((p) => p.price >= minPrice && p.price <= maxPrice);

    // Filter by Stock Availability
    if (stockOnly) {
      result = result.filter((p) => p.stock > 0);
    }

    // Sort Products
    if (sort === "price_asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sort === "price_desc") {
      result.sort((a, b) => b.price - a.price);
    } else {
      // Default / Newest sorting (latest items first)
      result.sort((a, b) => {
        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return timeB - timeA;
      });
    }

    return result;
  }, [products, query, category, minPrice, maxPrice, stockOnly, sort]);

  const clearSearchQuery = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("q");
    const nextQuery = params.toString();
    router.push(nextQuery ? `?${nextQuery}` : "?", { scroll: false });
  };

  return (
    <div className="container mx-auto flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="min-w-0">
          <p className="text-slate-900 font-semibold dark:text-slate-50">
            {filteredProducts.length} {t("productsCount")}
          </p>
          {query && (
            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-slate-600">
              <span className="inline-flex items-center gap-2 rounded-md border border-orange-200 bg-orange-50 px-3 py-1 font-medium text-orange-700">
                <Search className="h-3.5 w-3.5" />
                {t("searchResultFor", { query })}
              </span>
              <button
                type="button"
                className="inline-flex items-center gap-1 rounded-md px-2 py-1 font-semibold text-slate-500 hover:bg-slate-100 hover:text-slate-950"
                onClick={clearSearchQuery}
              >
                <X className="h-3.5 w-3.5" />
                {t("clearSearch")}
              </button>
            </div>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setFilterOpen(!filterOpen)}
          className="flex items-center gap-2 border-slate-200 bg-white transition-colors duration-200 ease-in-out dark:border-neutral-800 dark:bg-neutral-900"
          aria-label={filterOpen ? "Hide filters" : "Show filters"}
        >
          {filterOpen ? (
            <>
              <PanelLeftClose className="mr-2 h-4 w-4" />
              <span className="hidden sm:block">{t("hideFilters")}</span>
              <span className="sm:hidden">{t("hideFilters")}</span>
            </>
          ) : (
            <>
              <PanelLeftOpen className="mr-2 h-4 w-4" />
              <span className="hidden sm:block">{t("showFilters")}</span>
              <span className="sm:hidden">{t("filter")}</span>
            </>
          )}
        </Button>
      </div>
      <div className="flex flex-col lg:flex-row gap-8">
        <aside
          className={`shrink-0 transition-all duration-300 ease-in-out ${
            filterOpen ? "w-full lg:w-72 lg:opacity-100" : "hidden lg:hidden"
          } `}
        >
          <ProductFilters categories={categories} />
        </aside>
        <main className="flex-1 transition-all duration-300 ">
          {filteredProducts.length > 0 ? (
            <ProductCard products={filteredProducts} />
          ) : (
            <EmptyState
              icon={PackageSearch}
              title={t("emptyTitle")}
              description={
                query ? t("noSearchResults") : t("emptyDescription")
              }
            />
          )}
        </main>
      </div>
    </div>
  );
}
