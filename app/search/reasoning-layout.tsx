"use client";

import { ReasoningProvider } from "../../hooks/reasoning-context";
import { StreamingSummary } from "./streaming-summary";
import { TaskPlan } from "../types";
import { SourcesDisplay } from "./sources-display";
import ReasoningInterface from "./reasoning-interface";

interface ReasoningLayoutProps {
  initialTaskPlan: TaskPlan;
}

export default function ReasoningLayout({
  initialTaskPlan,
}: ReasoningLayoutProps) {
  return (
    <ReasoningProvider initialTaskPlan={initialTaskPlan}>
      <div className="space-y-6">
        <ReasoningInterface />
        <SourcesDisplay />
        <StreamingSummary />
      </div>
    </ReasoningProvider>
  );
}
