import { ChatOpenAI } from "@langchain/openai";

export const grok = new ChatOpenAI({
  model: "grok-beta",
  apiKey: process.env.XAI_API_KEY,
  configuration: {
    baseURL: "https://api.x.ai/v1",
  },
});
