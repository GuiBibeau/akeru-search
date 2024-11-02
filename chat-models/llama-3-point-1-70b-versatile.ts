import { ChatGroq } from "@langchain/groq";

export const llama3point1Versatile = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "llama-3.1-70b-versatile",
});
