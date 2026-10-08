import { Skeleton } from "@/components/skeletons";

export default function Loading() {
  return (
    <div aria-busy="true" aria-label="Loading document">
      <Skeleton className="h-3 w-40" />
      <Skeleton className="mt-3 h-9 w-96 max-w-full" />
      <Skeleton className="mt-2 h-3 w-64 max-w-full" />
      <div className="mt-6 grid gap-4 lg:grid-cols-[1.5fr_1fr]">
        <div className="rounded-3xl border border-black/[0.06] bg-white p-6">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="mt-4 h-24 w-full" />
        </div>
        <div className="space-y-4">
          <div className="rounded-3xl border border-black/[0.06] bg-white p-5">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="mt-3 h-4 w-full" />
            <Skeleton className="mt-2 h-4 w-5/6" />
            <Skeleton className="mt-4 h-11 w-full" />
          </div>
          <div className="rounded-3xl bg-ink p-5">
            <Skeleton className="h-12 w-full bg-white/10" />
            <Skeleton className="mt-2 h-12 w-full bg-white/10" />
          </div>
        </div>
      </div>
    </div>
  );
}
