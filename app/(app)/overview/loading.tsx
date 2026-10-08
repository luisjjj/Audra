import { HeaderSkeleton, KpiSkeleton, RowsSkeleton, Skeleton } from "@/components/skeletons";

export default function Loading() {
  return (
    <div aria-busy="true" aria-label="Loading overview">
      <HeaderSkeleton />
      <div className="mt-6 rounded-3xl bg-ink p-6 md:p-8">
        <Skeleton className="h-3 w-48 bg-white/10" />
        <Skeleton className="mt-3 h-12 w-64 max-w-full bg-white/10" />
        <Skeleton className="mt-4 h-3 w-full rounded-full bg-white/10" />
      </div>
      <KpiSkeleton />
      <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <RowsSkeleton count={3} />
        <div className="rounded-3xl border border-black/[0.06] bg-white p-5">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="mt-3 h-4 w-full" />
          <Skeleton className="mt-2 h-4 w-5/6" />
          <Skeleton className="mt-2 h-4 w-4/6" />
        </div>
      </div>
    </div>
  );
}
