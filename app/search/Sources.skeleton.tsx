import { Card, CardContent } from "@/components/ui/card";

interface SourcesSkeletonProps {
  count?: number;
}

export function SourcesSkeleton({ count = 8 }: SourcesSkeletonProps) {
  return (
    <div className="w-full">
      <div className="h-8 w-32 bg-gray-800 rounded-md mb-2 animate-pulse" />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: count }).map((_, index) => (
          <Card
            key={index}
            className="bg-black-800 border-gray-700 h-24 flex flex-col relative"
          >
            <CardContent className="p-3 flex flex-col flex-grow space-y-2">
              <div className="absolute top-2 right-2 w-4 h-4 bg-gray-800 rounded-full animate-pulse" />
              <div className="h-4 bg-gray-800 rounded w-3/4 animate-pulse" />
              <div className="h-3 bg-gray-800 rounded w-1/2 animate-pulse" />
              <div className="space-y-1">
                <div className="h-3 bg-gray-800 rounded w-full animate-pulse" />
                <div className="h-3 bg-gray-800 rounded w-4/5 animate-pulse" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
