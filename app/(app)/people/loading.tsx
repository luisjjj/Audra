import { HeaderSkeleton, RowsSkeleton } from "@/components/skeletons";

export default function Loading() {
  return (
    <div aria-busy="true" aria-label="Loading people">
      <HeaderSkeleton />
      <RowsSkeleton count={5} />
    </div>
  );
}
