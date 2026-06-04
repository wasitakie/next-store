import React, { useState, useEffect, useMemo, useCallback } from "react";
import { LocalizedProduct } from "@/types/product";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Slider } from "@/components/ui/slider";
import { RotateCcw, ChevronRight, SlidersHorizontal, ArrowUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";

interface ProductFiltersProps {
  categories?: (LocalizedProduct | string)[];
  locale?: string;
  totalCount?: number;
  filteredCount?: number;
  translations?: Record<string, string>;
}

export default function ProductFilters({ categories }: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations("ProductFilters");

  const currentCategory = searchParams.get("category") || "";
  const currentStock = searchParams.get("stock") === "true";
  const currentSort = searchParams.get("sort") || "newest";

  // Dynamic max price based on available products, rounding up to nearest hundred
  const maxAvailablePrice = useMemo(() => {
    if (!categories || categories.length === 0) return 5000;
    // Only map price if the items are LocalizedProduct objects
    const hasPrice = categories.some((p) => typeof p !== "string" && "price" in p);
    if (!hasPrice) return 5000;
    const maxVal = Math.max(
      ...categories
        .filter((p): p is LocalizedProduct => typeof p !== "string")
        .map((p) => p.price)
    );
    return Math.ceil(maxVal / 100) * 100 || 5000;
  }, [categories]);

  const urlMinPrice = Number(searchParams.get("minPrice")) || 0;
  const urlMaxPrice = Number(searchParams.get("maxPrice")) || maxAvailablePrice;

  // Local state for the price range input / slider
  const [priceRange, setPriceRange] = useState<[number, number]>([
    urlMinPrice,
    urlMaxPrice,
  ]);

  // Sync state if url updates externally
  useEffect(() => {
    setPriceRange([urlMinPrice, urlMaxPrice]);
  }, [urlMinPrice, urlMaxPrice]);

  const uniqueCategories = useMemo(() => {
    if (!categories) return [];
    
    // Check if we have standard product list or just strings
    const isStringArray = categories.every((c) => typeof c === "string");
    
    if (isStringArray) {
      return (categories as string[]).map((name) => ({
        name,
        count: 0,
      }));
    }

    const counts: Record<string, number> = {};
    (categories as LocalizedProduct[]).forEach((p) => {
      if (p.category) {
        counts[p.category] = (counts[p.category] || 0) + 1;
      }
    });
    return Object.entries(counts).map(([name, count]) => ({
      name,
      count,
    }));
  }, [categories]);

  const totalProductCount = useMemo(() => {
    if (!categories) return 0;
    const isStringArray = categories.every((c) => typeof c === "string");
    if (isStringArray) return 0; // Don't show count badges for raw string list
    return categories.length;
  }, [categories]);

  const updateFilters = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === "") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });
      router.push(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  const handleClearAllFilters = () => {
    setPriceRange([0, maxAvailablePrice]);
    router.push("?", { scroll: false });
  };

  const handleCategorySelect = (categoryName: string) => {
    updateFilters({ category: categoryName || null });
  };

  const handlePriceChange = (val: number[]) => {
    setPriceRange([val[0], val[1]]);
  };

  const handlePriceCommit = (val: number[]) => {
    updateFilters({
      minPrice: val[0] > 0 ? String(val[0]) : null,
      maxPrice: val[1] < maxAvailablePrice ? String(val[1]) : null,
    });
  };

  const handleMinPriceInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Math.min(Number(e.target.value) || 0, priceRange[1]);
    setPriceRange([val, priceRange[1]]);
    updateFilters({ minPrice: val > 0 ? String(val) : null });
  };

  const handleMaxPriceInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Math.max(Number(e.target.value) || 0, priceRange[0]);
    setPriceRange([priceRange[0], val]);
    updateFilters({ maxPrice: val < maxAvailablePrice ? String(val) : null });
  };

  const handleStockToggle = () => {
    updateFilters({ stock: !currentStock ? "true" : null });
  };

  const handleSortSelect = (sortType: string) => {
    updateFilters({ sort: sortType || null });
  };

  const hasActiveFilters =
    currentCategory !== "" ||
    currentStock ||
    urlMinPrice > 0 ||
    urlMaxPrice < maxAvailablePrice ||
    currentSort !== "newest";

  return (
    <div className="flex flex-col gap-6 bg-white dark:bg-neutral-900 border border-slate-100 dark:border-neutral-800 rounded-2xl p-6 shadow-sm">
      {/* Filter Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-neutral-800">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          <h2
            id="filter-heading"
            className="text-slate-900 text-lg font-bold dark:text-slate-50"
          >
            {t("filter")}
          </h2>
        </div>
        {hasActiveFilters && (
          <button
            type="button"
            className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600 font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded px-2 py-1 transition-all duration-200 hover:bg-red-50 dark:hover:bg-red-950/30"
            aria-label={t("clearAll")}
            onClick={handleClearAllFilters}
          >
            <RotateCcw className="h-3 w-3" />
            {t("clearAll")}
          </button>
        )}
      </div>

      {/* Sorting Tabs Section */}
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
          <ArrowUpDown className="h-4 w-4 text-slate-400" />
          {t("sortBy")}
        </h3>
        <div className="flex flex-col gap-1.5">
          {[
            { id: "newest", label: t("sortNewest") },
            { id: "price_asc", label: t("sortPriceAsc") },
            { id: "price_desc", label: t("sortPriceDesc") },
          ].map((option) => {
            const isSelected = currentSort === option.id;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => handleSortSelect(option.id)}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm transition-all duration-200 flex items-center justify-between ${
                  isSelected
                    ? "bg-indigo-50/80 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 font-semibold border-l-2 border-indigo-600"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50 dark:text-neutral-400 dark:hover:text-neutral-200 dark:hover:bg-neutral-800/50"
                }`}
              >
                <span>{option.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <hr className="border-slate-100 dark:border-neutral-800" />

      {/* Category Section */}
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
          {t("categories")}
        </h3>
        <div className="flex flex-col gap-1">
          {/* All Categories Option */}
          <button
            type="button"
            onClick={() => handleCategorySelect("")}
            className={`w-full text-left px-3.5 py-2 rounded-xl text-sm transition-all duration-200 flex items-center justify-between group ${
              !currentCategory
                ? "bg-indigo-50/80 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 font-semibold border-l-2 border-indigo-600"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50 dark:text-neutral-400 dark:hover:text-neutral-200 dark:hover:bg-neutral-800/50"
            }`}
          >
            <span>{t("allCategories")}</span>
            {totalProductCount > 0 && (
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                !currentCategory
                  ? "bg-indigo-100 dark:bg-indigo-900/60"
                  : "bg-slate-100 group-hover:bg-slate-200 dark:bg-neutral-800 dark:group-hover:bg-neutral-700 text-slate-500 dark:text-neutral-400"
              }`}>
                {totalProductCount}
              </span>
            )}
          </button>

          {/* Dynamic Categories */}
          {uniqueCategories.map((cat) => {
            const isSelected = currentCategory === cat.name;
            return (
              <button
                key={cat.name}
                type="button"
                onClick={() => handleCategorySelect(cat.name)}
                className={`w-full text-left px-3.5 py-2 rounded-xl text-sm transition-all duration-200 flex items-center justify-between group ${
                  isSelected
                    ? "bg-indigo-50/80 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 font-semibold border-l-2 border-indigo-600"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50 dark:text-neutral-400 dark:hover:text-neutral-200 dark:hover:bg-neutral-800/50"
                }`}
              >
                <span className="truncate flex items-center gap-1">
                  <ChevronRight className={`h-3 w-3 transition-transform ${isSelected ? "translate-x-0.5 text-indigo-500" : "opacity-0 group-hover:opacity-100 text-slate-400"}`} />
                  {cat.name}
                </span>
                {cat.count > 0 && (
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    isSelected
                      ? "bg-indigo-100 dark:bg-indigo-900/60"
                      : "bg-slate-100 group-hover:bg-slate-200 dark:bg-neutral-800 dark:group-hover:bg-neutral-700 text-slate-500 dark:text-neutral-400"
                  }`}>
                    {cat.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <hr className="border-slate-100 dark:border-neutral-800" />

      {/* Price Range Section */}
      <div className="flex flex-col gap-4">
        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
          {t("priceRange")}
        </h3>
        
        {/* Visual Slider */}
        <div className="px-2 py-2">
          <Slider
            min={0}
            max={maxAvailablePrice}
            step={10}
            value={[priceRange[0], priceRange[1]]}
            onValueChange={handlePriceChange}
            onValueCommit={handlePriceCommit}
            className="w-full"
          />
        </div>

        {/* Min/Max Manual Inputs */}
        <div className="grid grid-cols-2 gap-3 items-center">
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-xs font-semibold text-slate-400 dark:text-neutral-500">
              Min
            </span>
            <Input
              type="number"
              value={priceRange[0]}
              min={0}
              max={priceRange[1]}
              onChange={handleMinPriceInputChange}
              className="pl-10 h-10 rounded-xl bg-slate-50/50 border-slate-200 dark:bg-neutral-800/40 dark:border-neutral-800 text-sm font-medium"
            />
          </div>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-xs font-semibold text-slate-400 dark:text-neutral-500">
              Max
            </span>
            <Input
              type="number"
              value={priceRange[1]}
              min={priceRange[0]}
              max={maxAvailablePrice}
              onChange={handleMaxPriceInputChange}
              className="pl-10 h-10 rounded-xl bg-slate-50/50 border-slate-200 dark:bg-neutral-800/40 dark:border-neutral-800 text-sm font-medium"
            />
          </div>
        </div>
      </div>

      <hr className="border-slate-100 dark:border-neutral-800" />

      {/* Stock Availability Section */}
      <div className="flex items-center justify-between py-1">
        <div className="flex flex-col gap-0.5">
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            {t("availability")}
          </h3>
          <p className="text-xs text-slate-400 dark:text-neutral-500">
            {t("inStockOnly")}
          </p>
        </div>
        
        {/* iOS style toggle switch */}
        <button
          type="button"
          onClick={handleStockToggle}
          aria-label={t("inStockOnly")}
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
            currentStock ? "bg-indigo-600" : "bg-slate-200 dark:bg-neutral-800"
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
              currentStock ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
      </div>
    </div>
  );
}
