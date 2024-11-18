import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

export const StreamingSummarySkeleton = () => {
  return (
    <Card className="w-full mt-10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <FileText className="w-5 h-5" />
          Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="w-24 h-6 bg-muted animate-pulse rounded-full" />
        </div>
        <div className="space-y-3">
          <div className="h-4 bg-muted animate-pulse rounded" />
          <div className="h-4 bg-muted animate-pulse rounded w-[95%]" />
          <div className="h-4 bg-muted animate-pulse rounded w-[90%]" />
          <div className="h-4 bg-muted animate-pulse rounded w-[85%]" />
        </div>
      </CardContent>
    </Card>
  );
};
