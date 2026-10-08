"use client";

// Skeleton loading primitives — calm shimmer blocks that mirror page layouts
// so navigation feels like content resolving, not a spinner interrupting.
import { cn } from "@/lib/cn";

export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden className={cn("skeleton rounded-xl", className)} />;
}

export function HeaderSkeleton({ action = true }: { action?: boolean }) {
  return (
    <div>
      <Skeleton className="h-3 w-40" />
      <Skeleton className="mt-3 h-10 w-72 max-w-full md:h-12 md:w-96" />
      <div className="mt-3 flex items-end justify-between gap-3">
        <Skeleton className="h-4 w-56 max-w-full" />
        {action && <Skeleton className="hidden h-11 w-36 shrink-0 sm:block" />}
      </div>
    </div>
  );
}

export function PillsSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="mt-4 flex gap-2 overflow-hidden" aria-hidden>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="h-11 w-24 shrink-0 rounded-full" />
      ))}
    </div>
  );
}

export function KpiSkeleton() {
  return (
    <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4" aria-hidden>
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className={cn("rounded-3xl border border-black/[0.06] bg-white p-5", i > 1 && "hidden md:block")}>
          <Skeleton className="h-3 w-24" />
          <Skeleton className="mt-3 h-10 w-16" />
        </div>
      ))}
    </div>
  );
}

export function RowSkeleton() {
  return (
    <div aria-hidden className="rounded-2xl border border-black/[0.06] bg-white p-4">
      <div className="flex items-center justify-between gap-2">
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-7 w-24 shrink-0 rounded-full" />
      </div>
      <Skeleton className="mt-2 h-3 w-1/2" />
      <Skeleton className="mt-2 h-4 w-5/6" />
    </div>
  );
}

export function RowsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="mt-4 space-y-3" aria-hidden>
      {Array.from({ length: count }).map((_, i) => (
        <RowSkeleton key={i} />
      ))}
    </div>
  );
}

export function CardsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="mt-6 grid gap-4 md:grid-cols-2" aria-hidden>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-3xl border border-black/[0.06] bg-white p-6">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="mt-2 h-3 w-1/2" />
          <Skeleton className="mt-4 h-2.5 w-full rounded-full" />
          <Skeleton className="mt-4 h-11 w-full" />
        </div>
      ))}
    </div>
  );
}

export function TimelineSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="mt-6" aria-hidden>
      {Array.from({ length: count }).map((_, i, arr) => (
        <div key={i} className="flex gap-4">
          <div className="flex flex-col items-center">
            <Skeleton className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full" />
            {i < arr.length - 1 && <span className="w-px flex-1 bg-neutral-200" style={{ minHeight: 28 }} />}
          </div>
          <div className="mb-3 flex-1 rounded-2xl border border-black/[0.06] bg-white p-4">
            <Skeleton className="h-3 w-32" />
            <Skeleton className="mt-2 h-4 w-3/4" />
            <Skeleton className="mt-2 h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function SplitSkeleton() {
  return (
    <div className="mt-6 grid gap-4 lg:grid-cols-2" aria-hidden>
      {[0, 1].map((i) => (
        <div key={i} className="rounded-3xl border border-black/[0.06] bg-white p-6">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="mt-3 h-7 w-2/3" />
          <Skeleton className="mt-2 h-4 w-1/2" />
          <Skeleton className="mt-4 h-24 w-full" />
          <Skeleton className="mt-4 h-11 w-full" />
        </div>
      ))}
    </div>
  );
}
