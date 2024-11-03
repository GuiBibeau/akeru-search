"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { TaskPlan } from "../app/types";
import { executeSearch, executeSummarize } from "../lib/reasoning-api";
import {
  ReasoningContextType,
  QueueItem,
  ReasoningChainArtifact,
  SearchArtifact,
  ReasoningStatus,
} from "../app/types/reasoning";

const ReasoningContext = createContext<ReasoningContextType | undefined>(
  undefined
);

type ReasoningProviderProps = {
  children: React.ReactNode;
  initialTaskPlan: TaskPlan;
};

export const ReasoningProvider: React.FC<ReasoningProviderProps> = ({
  children,
  initialTaskPlan,
}) => {
  const [status, setStatus] = useState<ReasoningStatus>("idle");
  const [queueItems, setQueueItems] = useState<QueueItem[]>([]);
  const [artifacts, setArtifacts] = useState<ReasoningChainArtifact[]>([]);
  const [currentTask, setCurrentTask] = useState<QueueItem>();

  useEffect(() => {
    const initialQueue: QueueItem[] = initialTaskPlan.steps.map((step) => ({
      task: step,
      status: "pending",
    }));
    setQueueItems(initialQueue);
    setStatus("processing");
  }, [initialTaskPlan]);

  const processNextTask = useCallback(async () => {
    // Find next pending task that has all dependencies completed
    const nextTask = queueItems.find((item) => {
      if (item.status !== "pending") return false;

      // Check if all dependencies are completed
      const deps = item.task.dependencies || [];
      return deps.every((depId) =>
        queueItems.some(
          (qi) => qi.task.id === depId && qi.status === "completed"
        )
      );
    });

    if (!nextTask) {
      if (queueItems.every((item) => item.status === "completed")) {
        setStatus("completed");
      }
      return;
    }

    setCurrentTask(nextTask);

    try {
      // Update task status to processing
      setQueueItems((prev) =>
        prev.map((item) =>
          item.task.id === nextTask.task.id
            ? { ...item, status: "processing" }
            : item
        )
      );

      let result: ReasoningChainArtifact;

      switch (nextTask.task.action.type) {
        case "search": {
          const searchResults = await executeSearch(
            nextTask.task.action.params.query!
          );
          result = {
            taskId: nextTask.task.id,
            taskType: "search",
            artifact: searchResults,
          };
          break;
        }
        case "summarize": {
          const searchArtifacts = artifacts.filter(
            (a): a is SearchArtifact => a.taskType === "search"
          );
          const limitedResults = searchArtifacts.flatMap((a) => a.artifact);

          const summary = await executeSummarize(
            initialTaskPlan.query,
            limitedResults,
            nextTask.task.id,
            setArtifacts
          );

          result = {
            taskId: nextTask.task.id,
            taskType: "summarize",
            artifact: summary,
          };
          break;
        }
        case "requestInfo":
          setStatus("idle");
          return;
        default:
          throw new Error(`Unknown task type: ${nextTask.task.action.type}`);
      }

      // Update artifacts and queue status
      setArtifacts((prev) => [...prev, result]);
      setQueueItems((prev) =>
        prev.map((item) =>
          item.task.id === nextTask.task.id
            ? { ...item, status: "completed", result }
            : item
        )
      );
    } catch (error) {
      setQueueItems((prev) =>
        prev.map((item) =>
          item.task.id === nextTask.task.id
            ? { ...item, status: "error", error: (error as Error).message }
            : item
        )
      );
      setStatus("error");
    }
  }, [queueItems, artifacts, initialTaskPlan.query]);

  useEffect(() => {
    if (status === "processing") {
      processNextTask();
    }
  }, [status, processNextTask]);

  return (
    <ReasoningContext.Provider
      value={{
        taskPlan: initialTaskPlan,
        status,
        currentTask,
        artifacts,
        queueItems,
        submitRequestInfo: () => {},
      }}
    >
      {children}
    </ReasoningContext.Provider>
  );
};

export const useReasoningContext = () => {
  const context = useContext(ReasoningContext);
  if (!context) {
    throw new Error(
      "useReasoningContext must be used within a ReasoningProvider"
    );
  }
  return context;
};
