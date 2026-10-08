import { PillsSkeleton, Skeleton, TimelineSkeleton } from "@/components/skeletons";

export default function Loading() {
  return (
    <div aria-busy="true" aria-label="Loading activity">
      <Skeleton className="h-3 w-56" />
      <Skeleton className="mt-3 h-12 w-72 max-w-full" />
      <Skeleton className="mt-2 h-4 w-96 max-w-full" />
      <PillsSkeleton count={4} />
      <TimelineSkeleton count={5} />
    </div>
  );
}
