"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { ProcessedResult } from "../lib/processSearchResults";
import { TaskPlan, TaskStep } from "../types";

type ReasoningStatus = "idle" | "processing" | "completed" | "error";

export type SearchArtifact = {
  taskId: number;
  taskType: "search";
  artifact: ProcessedResult[];
};

type SummaryArtifact = {
  taskId: number;
  taskType: "summarize";
  artifact: string;
};

type ReasoningChainArtifact = SummaryArtifact | SearchArtifact;

type QueueItem = {
  task: TaskStep;
  status: "pending" | "processing" | "completed" | "error";
  result?: ReasoningChainArtifact;
  error?: string;
};

type ReasoningContextType = {
  taskPlan: TaskPlan;
  status: ReasoningStatus;
  currentTask?: QueueItem;
  artifacts: ReasoningChainArtifact[];
  queueItems: QueueItem[];
  pauseProcessing: () => void;
  resumeProcessing: () => void;
  isPaused: boolean;
};

const ReasoningContext = createContext<ReasoningContextType | undefined>(
  undefined
);

type ReasoningProviderProps = {
  children: React.ReactNode;
  initialTaskPlan: TaskPlan;
  processingInterval?: number;
};

export const ReasoningProvider: React.FC<ReasoningProviderProps> = ({
  children,
  initialTaskPlan,
  processingInterval = 1000, // Default 1 second between tasks
}) => {
  const [status, setStatus] = useState<ReasoningStatus>("idle");
  const [isPaused, setIsPaused] = useState(false);
  const [queueItems, setQueueItems] = useState<QueueItem[]>([]);
  const [artifacts, setArtifacts] = useState<ReasoningChainArtifact[]>([]);
  const [currentTask, setCurrentTask] = useState<QueueItem>();
  const processingTimeoutRef = useRef<NodeJS.Timeout>();

  // Initialize queue with tasks from task plan
  useEffect(() => {
    const initialQueue: QueueItem[] = initialTaskPlan.steps.map((step) => ({
      task: step,
      status: "pending",
    }));
    setQueueItems(initialQueue);
    setStatus("processing");
  }, [initialTaskPlan]);

  const executeSearch = async (query: string): Promise<ProcessedResult[]> => {
    const response = await fetch("/api/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to execute search");
    }

    const results = await response.json();
    return results.slice(0, 4); // Limit to 4 sources
  };

  const executeSummarize = async (
    query: string,
    searchResults: ProcessedResult[],
    onChunk: (chunk: string) => void
  ): Promise<string> => {
    const response = await fetch("/api/summarize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, sources: searchResults }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to execute summarization");
    }

    const reader = response.body?.getReader();
    if (!reader) throw new Error("Failed to get response body reader");

    const decoder = new TextDecoder();
    let summary = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      summary += chunk;
      onChunk(chunk);
    }

    return summary;
  };

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
          const limitedResults = searchArtifacts
            .flatMap((a) => a.artifact)
            .slice(0, 4);

          let streamingSummary = "";
          const summary = await executeSummarize(
            initialTaskPlan.query,
            limitedResults,
            (chunk) => {
              streamingSummary += chunk;
              setArtifacts((prev) => {
                const lastArtifact = prev[prev.length - 1];
                if (lastArtifact?.taskType === "summarize") {
                  return [
                    ...prev.slice(0, -1),
                    { ...lastArtifact, artifact: streamingSummary },
                  ];
                }
                return [
                  ...prev,
                  {
                    taskId: nextTask.task.id,
                    taskType: "summarize",
                    artifact: streamingSummary,
                  },
                ];
              });
            }
          );

          result = {
            taskId: nextTask.task.id,
            taskType: "summarize",
            artifact: summary,
          };
          break;
        }
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

  // Automatic processing loop
  useEffect(() => {
    if (status === "processing" && !isPaused) {
      processingTimeoutRef.current = setTimeout(
        processNextTask,
        processingInterval
      );
    }

    return () => {
      if (processingTimeoutRef.current) {
        clearTimeout(processingTimeoutRef.current);
      }
    };
  }, [status, isPaused, processNextTask, processingInterval]);

  const pauseProcessing = useCallback(() => {
    setIsPaused(true);
    if (processingTimeoutRef.current) {
      clearTimeout(processingTimeoutRef.current);
    }
  }, []);

  const resumeProcessing = useCallback(() => {
    setIsPaused(false);
  }, []);

  return (
    <ReasoningContext.Provider
      value={{
        taskPlan: initialTaskPlan,
        status,
        currentTask,
        artifacts,
        queueItems,
        pauseProcessing,
        resumeProcessing,
        isPaused,
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
