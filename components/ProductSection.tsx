"use client";
import { useState, useMemo } from "react";
import ProductCard from "@/components/ProductCard";
import ProductFilters from "@/components/ProductFilters";
import { LocalizedProduct } from "@/types/product";
import { Button } from "./ui/button";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";

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
  const searchParams = useSearchParams();

  // Parse search params for filtering
  const category = searchParams.get("category") || "";
  const minPrice = Number(searchParams.get("minPrice")) || 0;
  const maxPrice = Number(searchParams.get("maxPrice")) || Infinity;
  const stockOnly = searchParams.get("stock") === "true";
  const sort = searchParams.get("sort") || "newest";

  // Filter and sort products client-side
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Filter by Category
    if (category) {
      result = result.filter(
        (p) => p.category?.toLowerCase() === category.toLowerCase()
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
  }, [products, category, minPrice, maxPrice, stockOnly, sort]);

  return (
    <div className="flex flex-col gap-8 container mx-auto">
      {/* Product Filters - completely hidden when collapsed on desktop */}
      <div className="flex items-center justify-between">
        <p className="text-slate-900 font-semibold dark:text-slate-50">
          {filteredProducts.length} {t("productsCount")}
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setFilterOpen(!filterOpen)}
          className="flex items-center gap-2 border-zinc-200 bg-white shadow-sm transition-all duration-200 ease-in-out dark:bg-neutral-900 dark:border-neutral-800"
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
        {/* Product Cards */}
        <main className="flex-1 transition-all duration-300 ">
          {filteredProducts.length > 0 ? (
            <ProductCard products={filteredProducts} />
          ) : (
            <div className="flex flex-col items-center justify-center py-20 bg-slate-50/50 dark:bg-neutral-900/30 rounded-2xl border border-dashed border-slate-200 dark:border-neutral-800">
              <p className="text-slate-500 dark:text-neutral-400 font-medium">
                No products match the selected filters.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
