import { ChatGroq } from "@langchain/groq";
import { OpenAI } from "@langchain/openai";

export const llama3point1Groq = new ChatGroq({
  model: "llama-3.2-3b-preview",
});

export const llama3point1Gaia = new OpenAI({
  temperature: 0.9,
  configuration: {
    baseURL: "https://llama3.gaianet.network/v1/chat",
  },
});
