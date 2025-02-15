import { llama3point2 } from "@/chat-models/llama-3-point-1";
import { z } from "zod";
import { SearchArtifact } from "../app/types/reasoning";

const CryptoAssessmentSchema = z.object({
  isCryptoRelated: z.boolean(),
  confidence: z.number().min(0).max(1),
  riskLevel: z.enum(["low", "medium", "high"]),
  categories: z.array(z.string()),
  potentialRisks: z.array(z.string()),
});

type CryptoAssessment = z.infer<typeof CryptoAssessmentSchema>;

type ReasoningChainArtifact =
  | SearchArtifact
  | {
      taskId: number;
      taskType: "summarize";
      artifact: string;
    };

export async function assessCryptoContent(
  artifacts: ReasoningChainArtifact[]
): Promise<CryptoAssessment> {
  // Combine all relevant content from artifacts
  const content = artifacts
    .map((artifact) => {
      if (artifact.taskType === "search") {
        return artifact.artifact
          .map((result) => `${result.title}\n${result.summary}`)
          .join("\n");
      } else {
        return artifact.artifact;
      }
    })
    .join("\n");

  try {
    const response = await llama3point2.invoke([
      {
        role: "system",
        content: `You are an expert at identifying cryptocurrency and web3-related content and assessing its risk level. 
        Analyze the provided content and return a JSON object with the following structure:
        {
          "isCryptoRelated": boolean,
          "confidence": number between 0 and 1,
          "riskLevel": "low" | "medium" | "high",
          "categories": array of identified crypto categories,
          "potentialRisks": array of potential risks if applicable
        }
        
        Be conservative in your assessment. Only mark content as crypto-related if it's clearly about cryptocurrency, blockchain, or web3 technologies.`,
      },
      {
        role: "user",
        content: `Analyze this content for cryptocurrency/web3 related material:\n\n${content}`,
      },
    ]);

    const rawAssessment = JSON.parse(String(response.content));

    // Parse and validate the response using Zod
    return CryptoAssessmentSchema.parse(rawAssessment);
  } catch (error) {
    console.error("Error in crypto content assessment:", error);
    // Create a safe default that conforms to the schema
    return CryptoAssessmentSchema.parse({
      isCryptoRelated: false,
      confidence: 0,
      riskLevel: "low",
      categories: [],
      potentialRisks: [],
    });
  }
}
