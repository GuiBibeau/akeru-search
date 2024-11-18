import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Radio } from "lucide-react";

export function LatestNewsSkeleton() {
  return (
    <Card className="w-full max-w-3xl">
      <CardHeader className="flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Radio className="h-4 w-4 text-muted" aria-hidden="true" />
          <div className="h-6 w-32 animate-pulse rounded-md bg-muted" />
        </div>
        <div className="h-4 w-24 animate-pulse rounded-md bg-muted" />
      </CardHeader>
      <CardContent className="grid gap-6">
        {[1, 2, 3].map((_, index) => (
          <div key={index} className="grid gap-2 rounded-lg p-2">
            <div className="flex items-start justify-between gap-4">
              <div className="h-6 w-3/4 animate-pulse rounded-md bg-muted" />
              <div className="h-5 w-5 animate-pulse rounded-md bg-muted" />
            </div>
            <div className="h-4 w-full animate-pulse rounded-md bg-muted" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
