import { SourcesSkeleton } from "./sources-skeleton";
import { StreamingSummarySkeleton } from "./streaming-summary-skeleton";

export default function Loading() {
  return (
    <>
      <SourcesSkeleton />
      <StreamingSummarySkeleton />
    </>
  );
}
