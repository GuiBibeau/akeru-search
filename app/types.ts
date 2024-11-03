export interface TaskActionParams {
  query?: string;
  prompt?: string;
  requiredInfo?: string[];
}

export type TaskActionType = "search" | "summarize" | "requestInfo";

export interface TaskAction {
  type: TaskActionType;
  params: TaskActionParams;
}

export interface TaskStep {
  id: number;
  description: string;
  dependencies?: number[];
  action: TaskAction;
}

export interface TaskPlan {
  query: string;
  steps: TaskStep[];
}
