"use client";

import { NavBar } from "@/components/NavBar";
import { ReasoningProvider } from "./reasoning-context";
import ConnectedReasoningInterface from "./connected-reasoning-interface";
import { StreamingSummary } from "./streaming-summary";
import { TaskPlan } from "../types";
import { SourcesDisplay } from "./sources-display";

interface ReasoningLayoutProps {
  initialQuery: string;
  initialTaskPlan: TaskPlan;
}

export default function ReasoningLayout({
  initialQuery,
  initialTaskPlan,
}: ReasoningLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-grow flex justify-center p-4">
        <div className="w-full max-w-4xl space-y-6">
          <h1 className="text-3xl font-bold">{initialQuery}</h1>
          <ReasoningProvider initialTaskPlan={initialTaskPlan}>
            <div className="space-y-6">
              <ConnectedReasoningInterface />
              <SourcesDisplay />
              <StreamingSummary />
            </div>
          </ReasoningProvider>
        </div>
      </main>
    </div>
  );
}
