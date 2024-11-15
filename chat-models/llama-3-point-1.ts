import { ChatGroq } from "@langchain/groq";
import { OpenAI } from "@langchain/openai";

export const llama3point2 = new ChatGroq({
  model: "llama-3.2-1b-preview",
});

export const llama3point170 = new ChatGroq({
  model: "llama-3.1-70b-versatile",
});

export const llama3point1Gaia = new OpenAI({
  temperature: 0.9,
  configuration: {
    baseURL: "https://llama3.gaianet.network/v1/chat",
  },
});

export const llama3point1GaiaJson = new OpenAI({
  temperature: 0.9,
  configuration: {
    baseURL: "https://llama3.gaianet.network/v1/chat",
  },
  modelKwargs: {
    response_format: { type: "json_object" },
  },
});
