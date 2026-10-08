import { HeaderSkeleton, RowsSkeleton } from "@/components/skeletons";

export default function Loading() {
  return (
    <div aria-busy="true" aria-label="Loading notifications">
      <HeaderSkeleton action={false} />
      <RowsSkeleton count={4} />
    </div>
  );
}
