import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ReasoningInterfaceSkeleton() {
  return (
    <Card className="w-full max-w-4xl">
      <CardHeader className="py-3">
        <CardTitle className="text-base flex items-center justify-between">
          <Skeleton className="h-4 w-40" />
        </CardTitle>
      </CardHeader>
      <CardContent className="py-3">
        <div className="space-y-2">
          {[1, 2, 3].map((step) => (
            <Card key={step}>
              <CardContent className="p-3 flex items-center space-x-4">
                <Skeleton className="w-6 h-6 rounded-full flex-shrink-0" />
                <div className="space-y-2 flex-grow">
                  <Skeleton className="h-4 w-11/12" />
                  <Skeleton className="h-3 w-5/6" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
