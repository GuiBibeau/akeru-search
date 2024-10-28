
import { ChatOpenAI } from "@langchain/openai";

export const gpt3point5 =  new ChatOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  model: "gpt-3.5-turbo-0125",
});