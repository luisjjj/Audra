import { HeaderSkeleton, PillsSkeleton, RowsSkeleton } from "@/components/skeletons";

export default function Loading() {
  return (
    <div aria-busy="true" aria-label="Loading requests">
      <HeaderSkeleton />
      <PillsSkeleton />
      <RowsSkeleton count={4} />
    </div>
  );
}
