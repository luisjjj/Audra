import { PillsSkeleton, Skeleton, TimelineSkeleton } from "@/components/skeletons";

export default function Loading() {
  return (
    <div aria-busy="true" aria-label="Loading engagement">
      <Skeleton className="h-3 w-56" />
      <Skeleton className="mt-3 h-10 w-80 max-w-full md:h-12" />
      <Skeleton className="mt-2 h-4 w-64 max-w-full" />
      <PillsSkeleton count={6} />
      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="rounded-3xl border border-black/[0.06] bg-white p-6 lg:col-span-2">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="mt-3 h-2.5 w-full rounded-full" />
        </div>
        <div className="rounded-3xl bg-ink p-6">
          <Skeleton className="h-3 w-32 bg-white/10" />
          <Skeleton className="mt-3 h-4 w-full bg-white/10" />
          <Skeleton className="mt-2 h-4 w-4/6 bg-white/10" />
        </div>
      </div>
      <div className="mt-4 rounded-3xl border border-black/[0.06] bg-white p-6">
        <Skeleton className="h-7 w-64 max-w-full" />
        <TimelineSkeleton count={4} />
      </div>
    </div>
  );
}
