import { NavBar } from "@/components/NavBar";
import ReasoningInterfaceSkeleton from "./reasoning-interface-skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-grow flex justify-center p-4">
        <div className="w-full max-w-4xl space-y-6">
          <div className="h-9 w-2/3">
            <div className="h-full w-full animate-pulse rounded-md bg-primary/10" />
          </div>
          <div className="space-y-6">
            <ReasoningInterfaceSkeleton />
          </div>
        </div>
      </main>
    </div>
  );
}
