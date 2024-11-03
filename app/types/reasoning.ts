import { ProcessedResult } from "../lib/processSearchResults";
import { TaskPlan, TaskStep } from "../types";

export type ReasoningStatus = "idle" | "processing" | "completed" | "error";

export type SearchArtifact = {
  taskId: number;
  taskType: "search";
  artifact: ProcessedResult[];
};

export type SummaryArtifact = {
  taskId: number;
  taskType: "summarize";
  artifact: string;
};

export type RequestInformationArtifact = {
  taskId: number;
  taskType: "requestInfo";
  artifact: {
    question: string;
    answer?: string;
  };
};

export type ReasoningChainArtifact =
  | SummaryArtifact
  | SearchArtifact
  | RequestInformationArtifact;

export type QueueItem = {
  task: TaskStep;
  status: "pending" | "processing" | "completed" | "error";
  result?: ReasoningChainArtifact;
  error?: string;
};

export type ReasoningContextType = {
  taskPlan: TaskPlan;
  status: ReasoningStatus;
  currentTask?: QueueItem;
  artifacts: ReasoningChainArtifact[];
  queueItems: QueueItem[];
  submitRequestInfo: (taskId: number, answer: string) => void;
};
