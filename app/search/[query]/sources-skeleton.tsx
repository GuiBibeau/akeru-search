import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function SourcesSkeleton() {
  return (
    <div className="w-full space-y-4">
      <h2 className="text-2xl font-semibold">Sources</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="overflow-hidden">
            <CardContent className="p-4 h-full flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-5 w-5 rounded-sm" />
                </div>
                <div className="space-y-1">
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-4/5" />
                </div>
              </div>
              <div className="flex items-center justify-between mt-4">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
