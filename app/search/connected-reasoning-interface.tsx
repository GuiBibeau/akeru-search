"use client";
import { useReasoningContext } from "./reasoning-context";
import ReasoningInterface from "./reasoning-interface";
import { SourcesDisplay } from "./sources-display";

const ConnectedReasoningInterface = () => {
  const {
    taskPlan,
    status,
    queueItems,
    isPaused,
    resumeProcessing,
    pauseProcessing,
  } = useReasoningContext();

  // Calculate current step based on completed and processing items
  const getCurrentStep = () => {
    const processingItem = queueItems.findIndex(
      (item) => item.status === "processing"
    );
    if (processingItem !== -1) return processingItem;

    const lastCompleted = queueItems.reduce((acc, item, index) => {
      return item.status === "completed" ? index : acc;
    }, -1);
    return lastCompleted + 1;
  };

  const handleStart = () => {
    if (status === "idle" || isPaused) {
      resumeProcessing();
    } else {
      pauseProcessing();
    }
  };

  const reasoningData = {
    query: taskPlan.query,
    steps: taskPlan.steps,
  };

  return (
    <div className="space-y-6">
      <ReasoningInterface
        reasoningData={reasoningData}
        currentStep={getCurrentStep()}
        isProcessing={status === "processing" && !isPaused}
        onStart={handleStart}
      />
      <SourcesDisplay />
    </div>
  );
};

export default ConnectedReasoningInterface;
