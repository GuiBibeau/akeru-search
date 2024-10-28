import { NavBar } from "@/components/NavBar";
import { SourcesSkeleton } from "./SourcesSkeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <NavBar />
      <div className="flex-grow flex justify-center p-4">
        <div className="w-full max-w-3xl flex flex-col items-center">
          <div className="w-full flex flex-col items-start">
            <div className="h-9 w-64 bg-gray-800 rounded-md animate-pulse" />
          </div>
          <div className="mt-6 w-full flex flex-col">
            <SourcesSkeleton />
            <div className="mt-8">
              <div className="space-y-4">
                <div className="h-4 bg-gray-800 rounded w-3/4 animate-pulse" />
                <div className="h-4 bg-gray-800 rounded w-full animate-pulse" />
                <div className="h-4 bg-gray-800 rounded w-5/6 animate-pulse" />
                <div className="h-4 bg-gray-800 rounded w-4/5 animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
