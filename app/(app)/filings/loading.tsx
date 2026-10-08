import { CardsSkeleton, HeaderSkeleton } from "@/components/skeletons";

export default function Loading() {
  return (
    <div aria-busy="true" aria-label="Loading filings">
      <HeaderSkeleton />
      <CardsSkeleton count={4} />
    </div>
  );
}
