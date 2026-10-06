"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { useRouter } from "@/i18n/routing";
import {
  ArrowRight,
  PackageSearch,
  SearchIcon,
  Sparkles,
  X,
} from "lucide-react";
import { FormEvent, useMemo, useState } from "react";

type SearchLabels = {
  title: string;
  description: string;
  placeholder: string;
  submit: string;
  popularTitle: string;
  emptyHint: string;
  close: string;
  suggestions: string[];
};

type SearchProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  labels: SearchLabels;
};

export default function Search({
  open,
  onOpenChange,
  labels,
}: SearchProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const trimmedQuery = query.trim();
  const quickSearches = useMemo(
    () => labels.suggestions.filter(Boolean),
    [labels.suggestions],
  );

  const submitSearch = (value: string) => {
    const nextQuery = value.trim();
    if (!nextQuery) return;

    router.push(`/products?q=${encodeURIComponent(nextQuery)}`);
    setQuery("");
    onOpenChange(false);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submitSearch(query);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="top"
        className="border-b border-neutral-200 bg-white p-0 shadow-2xl"
      >
        <div className="mx-auto w-full max-w-4xl px-4 py-5 sm:px-6 lg:px-8">
          <SheetHeader className="mb-4 text-left">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-md bg-neutral-950 text-white">
                  <PackageSearch className="h-5 w-5 text-neutral-300" />
                </div>
                <SheetTitle className="text-2xl font-bold text-neutral-950">
                  {labels.title}
                </SheetTitle>
                <SheetDescription className="mt-2 max-w-2xl text-sm leading-6 text-neutral-600">
                  {labels.description}
                </SheetDescription>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-10 w-10 shrink-0 rounded-md text-neutral-500 hover:bg-neutral-100 hover:text-neutral-950"
                aria-label={labels.close}
                onClick={() => onOpenChange(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </SheetHeader>

          <form
            onSubmit={handleSubmit}
            className="rounded-md border border-neutral-200 bg-neutral-50 p-2"
          >
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative flex-1">
                <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -tranneutral-y-1/2 text-neutral-400" />
                <Input
                  autoFocus
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={labels.placeholder}
                  className="h-12 border-neutral-200 bg-white pl-10 pr-4 text-base shadow-sm"
                />
              </div>
              <Button
                type="submit"
                disabled={!trimmedQuery}
                className="h-12 rounded-full bg-neutral-950 px-5 text-white hover:bg-neutral-800"
              >
                <SearchIcon className="h-4 w-4" />
                {labels.submit}
              </Button>
            </div>
          </form>

          <div className="mt-5 grid gap-3 sm:grid-cols-[160px_1fr] sm:items-start">
            <div className="flex items-center gap-2 text-sm font-semibold text-neutral-700">
              <Sparkles className="h-4 w-4 text-neutral-500" />
              {labels.popularTitle}
            </div>
            <div className="flex flex-wrap gap-2">
              {quickSearches.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => submitSearch(item)}
                  className="inline-flex h-9 items-center gap-2 rounded-md border border-neutral-200 bg-white px-3 text-sm font-medium text-neutral-700 transition-colors hover:border-neutral-200 hover:bg-neutral-50 hover:text-neutral-700"
                >
                  {item}
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              ))}
            </div>
          </div>

          <p className="mt-5 rounded-md bg-neutral-950 px-4 py-3 text-sm leading-6 text-neutral-200">
            {labels.emptyHint}
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
