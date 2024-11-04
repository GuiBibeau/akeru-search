import { llama3point1Groq } from "@/chat-models/llama-3-point-1";
import { gpt3point5 } from "@/chat-models/gpt-3.5";
import { SummaryTool } from "./SummaryTool";
import { z } from "zod";
import { TaskPlan } from "../app/types";

const TaskActionParamsSchema = z.object({
  query: z.string(),
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
        `You are a research assistant specialized in cryptocurrency and web3 topics. Your role is to break down research queries into clear search and summarization steps.
Answer nothing else but the JSON. Don't include any other text.

Output must be valid JSON in the following format:
{
  "query": "original query",
  "steps": [
    {
      "id": number,
      "description": "specific research action being taken",
      "dependencies": [list of step IDs that must be completed before this step],
      "action": {
        "type": "search|summarize",
        "params": {
          "query": "specific search or summarization query"
        }
      }
    }
  ]
}

Research Process:
1. search: Find relevant information about the topic
2. summarize: Create a concise summary of the search results

Guidelines:
1. Focus on gathering accurate and up-to-date information
2. Break complex queries into clear research steps
3. Use dependencies to build upon previous findings
4. Ensure each step contributes to answering the research question
5. Maximum 2 steps allowed, typically a search followed by a summary"`,
      ],
      ["human", `Research this crypto topic: "${query}"`],
    ];
  }

  async planTask(query: string): Promise<TaskPlan> {
    try {
      const response = await this.model.invoke(this.createPrompt(query));
      const parsedJson = JSON.parse(String(response.content));
      const validatedPlan: TaskPlan = TaskPlanSchema.parse(parsedJson);
      return validatedPlan;
    } catch (error) {
      console.error("Error in planTask method:", error);
      throw error;
    }
  }
}
