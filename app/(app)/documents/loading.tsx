import { CardsSkeleton, HeaderSkeleton, PillsSkeleton, Skeleton } from "@/components/skeletons";

export default function Loading() {
  return (
    <div aria-busy="true" aria-label="Loading documents">
      <HeaderSkeleton />
      <Skeleton className="mt-4 h-[52px] w-full rounded-2xl border border-black/[0.06]" />
      <PillsSkeleton count={7} />
      <CardsSkeleton count={4} />
    </div>
  );
}
