"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function TokenPriceChartSkeleton() {
  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-7 w-64" />
        </CardTitle>
        <CardDescription>
          <Skeleton className="h-4 w-24" />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-[400px] w-full" />
      </CardContent>
    </Card>
  );
}
