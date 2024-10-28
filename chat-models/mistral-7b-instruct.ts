import { ChatGroq } from "@langchain/groq";

export const mistralGroq = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "mixtral-8x7b-32768",
});
