import { CardsSkeleton, HeaderSkeleton } from "@/components/skeletons";

export default function Loading() {
  return (
    <div aria-busy="true" aria-label="Loading engagements">
      <HeaderSkeleton />
      <CardsSkeleton count={4} />
    </div>
  );
}
