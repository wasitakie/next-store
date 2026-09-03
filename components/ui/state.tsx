import type { LucideIcon } from "lucide-react";
import { AlertCircle, PackageSearch } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

type StateBlockProps = {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
};

export function EmptyState({
  icon: Icon = PackageSearch,
  title,
  description,
  action,
  className,
}: StateBlockProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-md border border-dashed border-slate-200 bg-white px-6 py-14 text-center",
        className,
      )}
    >
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-md border border-slate-200 bg-slate-50 text-slate-500">
        <Icon className="h-7 w-7" />
      </div>
      <h2 className="text-xl font-bold text-slate-950">{title}</h2>
      {description ? (
        <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
          {description}
        </p>
      ) : null}
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}

export function ErrorState({
  icon: Icon = AlertCircle,
  title,
  description,
  action,
  className,
}: StateBlockProps) {
  return (
    <div
      className={cn(
        "rounded-md border border-red-200 bg-red-50 px-4 py-3 text-red-900",
        className,
      )}
      role="alert"
    >
      <div className="flex gap-3">
        <Icon className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
        <div className="min-w-0">
          <p className="font-semibold">{title}</p>
          {description ? (
            <p className="mt-1 text-sm leading-6 text-red-700">
              {description}
            </p>
          ) : null}
          {action ? <div className="mt-3">{action}</div> : null}
        </div>
      </div>
    </div>
  );
}

export function LoadingState({
  className,
}: Omit<StateBlockProps, "icon" | "action">) {
  return (
    <div
      className={cn(
        "rounded-md border border-slate-200 bg-white p-6",
        className,
      )}
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      <div className="mx-auto flex max-w-md flex-col items-center text-center">
        <Skeleton className="h-14 w-14" />
        <Skeleton className="mt-5 h-5 w-48" />
        <Skeleton className="mt-3 h-4 w-full max-w-sm" />
        <Skeleton className="mt-2 h-4 w-3/4 max-w-xs" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="container mx-auto grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-5 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-md border border-slate-200 bg-white"
        >
          <Skeleton className="h-52 rounded-none" />
          <div className="space-y-3 p-4">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-2/3" />
            <div className="flex items-center justify-between pt-1">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function CartSkeleton({ compact = false }: { compact?: boolean }) {
  return (
    <div className={cn("space-y-4", compact ? "p-0" : "p-6")}>
      {Array.from({ length: compact ? 3 : 4 }).map((_, index) => (
        <div
          key={index}
          className="flex gap-4 rounded-md border border-slate-200 bg-white p-3"
        >
          <Skeleton className="h-20 w-20 shrink-0" />
          <div className="flex flex-1 flex-col justify-between py-1">
            <div className="space-y-2">
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="flex items-center justify-between">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-8" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function CartPageSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 space-y-3">
          <Skeleton className="h-8 w-44" />
          <Skeleton className="h-4 w-64" />
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="rounded-md border border-slate-200 bg-white p-6"
              >
                <div className="flex gap-4">
                  <Skeleton className="h-24 w-24 shrink-0" />
                  <div className="flex flex-1 flex-col justify-between">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1 space-y-2">
                        <Skeleton className="h-5 w-4/5" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                      <Skeleton className="h-5 w-28" />
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <Skeleton className="h-10 w-32" />
                      <Skeleton className="h-9 w-24" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="rounded-md border border-slate-200 bg-white p-6">
              <Skeleton className="h-6 w-40" />
              <div className="mt-6 space-y-4">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-12" />
                </div>
                <Skeleton className="h-px w-full rounded-none" />
                <div className="flex justify-between">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-5 w-24" />
                </div>
                <Skeleton className="h-11 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CartDrawerSkeleton() {
  return (
    <div className="flex-1 space-y-4 overflow-hidden px-6 py-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="flex gap-4 rounded-md border border-slate-200 bg-white p-3"
        >
          <Skeleton className="h-20 w-20 shrink-0" />
          <div className="flex flex-1 flex-col justify-between py-1">
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="flex items-center justify-between">
              <Skeleton className="h-7 w-24" />
              <Skeleton className="h-7 w-7" />
            </div>
          </div>
        </div>
      ))}

      <div className="space-y-3 border-t border-slate-100 pt-4">
        <div className="flex justify-between">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    </div>
  );
}

export function WishlistSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-3">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-48" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>

        <div className="grid gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="rounded-md border border-slate-200 bg-white p-4 sm:p-5"
            >
              <div className="grid gap-4 sm:grid-cols-[112px_1fr_auto] sm:items-center">
                <Skeleton className="h-28 w-full sm:w-28" />
                <div className="min-w-0 space-y-3">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-5 w-full max-w-md" />
                  <Skeleton className="h-5 w-28" />
                </div>
                <div className="flex flex-wrap gap-2 sm:justify-end">
                  <Skeleton className="h-10 w-32" />
                  <Skeleton className="h-10 w-28" />
                  <Skeleton className="h-10 w-10" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function PageSkeleton() {
  return (
    <main className="min-h-screen bg-background px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="rounded-md border border-slate-200 bg-white p-6">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="mt-3 h-4 w-full max-w-xl" />
          <Skeleton className="mt-2 h-4 w-80" />
        </div>
        <ProductGridSkeleton count={8} />
      </div>
    </main>
  );
}

export function AboutPageSkeleton() {
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_440px] lg:px-8">
          <div className="flex flex-col justify-center">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="mt-4 h-10 w-full max-w-2xl sm:h-12" />
            <Skeleton className="mt-3 h-10 w-4/5 max-w-xl sm:h-12" />
            <Skeleton className="mt-6 h-5 w-full max-w-2xl" />
            <Skeleton className="mt-3 h-5 w-11/12 max-w-xl" />
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Skeleton className="h-11 w-full sm:w-36" />
              <Skeleton className="h-11 w-full sm:w-32" />
            </div>
          </div>

          <div className="relative min-h-[320px] overflow-hidden rounded-md border border-slate-200 bg-white p-6">
            <Skeleton className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute inset-x-6 bottom-6 space-y-3">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="rounded-md border border-slate-200 bg-white p-6"
            >
              <Skeleton className="h-11 w-11" />
              <Skeleton className="mt-5 h-5 w-36" />
              <Skeleton className="mt-4 h-4 w-full" />
              <Skeleton className="mt-2 h-4 w-5/6" />
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-8 max-w-2xl">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="mt-4 h-8 w-full max-w-lg" />
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="rounded-md border border-slate-200 bg-slate-50 p-6"
              >
                <div className="mb-5 flex items-center gap-3">
                  <Skeleton className="h-10 w-10" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <Skeleton className="h-5 w-40" />
                <Skeleton className="mt-4 h-4 w-full" />
                <Skeleton className="mt-2 h-4 w-5/6" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export function ContactPageSkeleton() {
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="mt-4 h-10 w-full max-w-2xl sm:h-12" />
          <Skeleton className="mt-3 h-10 w-4/5 max-w-xl sm:h-12" />
          <Skeleton className="mt-6 h-5 w-full max-w-3xl" />
          <Skeleton className="mt-3 h-5 w-2/3 max-w-2xl" />
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_420px] lg:px-8">
        <div className="rounded-md border border-slate-200 bg-white p-6 sm:p-8">
          <div className="mb-6 flex items-center gap-3">
            <Skeleton className="h-11 w-11" />
            <div className="space-y-2">
              <Skeleton className="h-7 w-52" />
              <Skeleton className="h-4 w-64" />
            </div>
          </div>
          <div className="grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormFieldSkeleton />
              <FormFieldSkeleton />
            </div>
            <FormFieldSkeleton />
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-36 w-full" />
            </div>
            <Skeleton className="h-10 w-full sm:w-36" />
          </div>
        </div>

        <div className="grid gap-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="rounded-md border border-slate-200 bg-white p-5"
            >
              <div className="flex gap-4">
                <Skeleton className="h-11 w-11 shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-44" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            </div>
          ))}

          <div className="rounded-md border border-slate-200 bg-white p-6">
            <div className="mb-4 flex items-center gap-3">
              <Skeleton className="h-5 w-5" />
              <Skeleton className="h-5 w-36" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between gap-4">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-28" />
              </div>
              <div className="flex justify-between gap-4">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-28" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export function AdminPageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-4 w-full max-w-lg" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="rounded-md border border-slate-200 bg-white p-6"
          >
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4" />
            </div>
            <Skeleton className="mt-5 h-8 w-28" />
            <Skeleton className="mt-3 h-3 w-32" />
          </div>
        ))}
      </div>

      <div className="rounded-md border border-slate-200 bg-white p-6 lg:max-w-4xl">
        <Skeleton className="h-6 w-40" />
        <div className="mt-6 space-y-6">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex items-center">
              <Skeleton className="h-10 w-10" />
              <div className="ml-4 flex-1 space-y-2">
                <Skeleton className="h-4 w-44" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-4 w-20" />
            </div>
          ))}
        </div>
        <Skeleton className="mt-6 h-10 w-full" />
      </div>
    </div>
  );
}

export function AdminTableSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-3">
          <Skeleton className="h-8 w-44" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      <div className="overflow-hidden rounded-md border border-slate-200 bg-white">
        <div className="border-b bg-slate-50 px-6 py-4">
          <div className="grid grid-cols-5 gap-6">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className="h-3 w-full" />
            ))}
          </div>
        </div>
        <div className="divide-y divide-slate-100">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="grid grid-cols-5 gap-6 px-6 py-4">
              <div className="col-span-2 flex items-center gap-3">
                <Skeleton className="h-10 w-10 shrink-0" />
                <Skeleton className="h-4 w-full" />
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <div className="flex justify-end gap-2">
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FormFieldSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-10 w-full" />
    </div>
  );
}
