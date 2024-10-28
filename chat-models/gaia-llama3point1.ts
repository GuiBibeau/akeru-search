import { ChatOpenAI } from "@langchain/openai";

export const gaia3point1 = new ChatOpenAI({
  model: "llama",
  configuration: {
    baseURL: "https://llama.us.gaianet.network/v1",
  },
});
