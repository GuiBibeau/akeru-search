import { ChatOpenAI } from "@langchain/openai";

export const gaiaGemma = new ChatOpenAI({
  model: "gemma",
  configuration: {
    baseURL: "https://gemma.us.gaianet.network/v1",
  },
});
