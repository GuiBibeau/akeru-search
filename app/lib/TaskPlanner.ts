import { llama3point1Groq } from "@/chat-models/llama-3-point-1";
import { gpt3point5 } from "@/chat-models/gpt-3.5";
import { SummaryTool } from "./SummaryTool";
import { z } from "zod";
import { TaskPlan } from "../types";

const TaskActionParamsSchema = z.object({
  query: z.string().optional(),
});

const TaskActionSchema = z.object({
  type: z.enum(["search", "summarize"]),
  params: TaskActionParamsSchema,
});

const TaskStepSchema = z.object({
  id: z.number(),
  description: z.string(),
  dependencies: z.array(z.number()).optional(),
  action: TaskActionSchema,
});

const TaskPlanSchema = z.object({
  query: z.string(),
  steps: z.array(TaskStepSchema),
});

export class TaskPlanner {
  private model;
  private summaryTool: SummaryTool;

  constructor(
    model: typeof llama3point1Groq | typeof gpt3point5 = llama3point1Groq
  ) {
    this.model = model;
    this.summaryTool = new SummaryTool(model);
  }

  private createPrompt(query: string): [string, string][] {
    return [
      [
        "system",
        `You are an autonomous web agent capable of executing online tasks through search and summarization.
Answer nothing else but the JSON. Don't include any other text.

Output must be valid JSON in the following format:
{
  "query": "original query",
  "steps": [
    {
      "id": number,
      "description": "specific action being taken",
      "dependencies": [list of step IDs that must be completed before this step],
      "action": {
        "type": "search|summarize",
        "params": {
          "query": "search query text"
        }
      }
    }
  ]
}

Available actions:
1. search: Perform a web search with the given query
2. summarize: Generate a summary of search results for the query

Rules:
1. Each step must be an actual executable action
2. Provide a maximum of 2 steps only
3. Use dependencies to ensure proper order of operations
4. Consider rate limits between actions`,
      ],
      ["human", `Execute this online task: "${query}"`],
    ];
  }

  async planTask(query: string): Promise<TaskPlan> {
    try {
      const response = await this.model.invoke(this.createPrompt(query));
      console.log(response);
      const parsedJson = JSON.parse(String(response.content));
      const validatedPlan: TaskPlan = TaskPlanSchema.parse(parsedJson);
      return validatedPlan;
    } catch (error) {
      console.error("Error in planTask method:", error);
      throw error;
    }
  }
}
