export interface TaskActionParams {
  query?: string;
}

export type TaskActionType = "search" | "summarize";

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
