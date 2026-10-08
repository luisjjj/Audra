import { HeaderSkeleton, SplitSkeleton } from "@/components/skeletons";

export default function Loading() {
  return (
    <div aria-busy="true" aria-label="Loading settings">
      <HeaderSkeleton action={false} />
      <SplitSkeleton />
    </div>
  );
}
