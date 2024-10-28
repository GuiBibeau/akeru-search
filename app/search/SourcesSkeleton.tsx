import { Card, CardContent } from "@/components/ui/card";

export function SourcesSkeleton() {
  return (
    <div className="w-full">
      <div className="h-8 w-32 bg-gray-800 rounded-lg mb-4 animate-pulse" />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(3)].map((_, index) => (
          <Card
            key={index}
            className="bg-black-800 border-gray-700 h-24 flex flex-col relative animate-pulse"
          >
            <CardContent className="p-3 flex flex-col flex-grow space-y-2">
              <div className="h-4 bg-gray-800 rounded w-3/4" />
              <div className="h-3 bg-gray-800 rounded w-1/2" />
              <div className="h-3 bg-gray-800 rounded w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
