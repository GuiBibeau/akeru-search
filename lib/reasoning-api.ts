import { ProcessedResult } from "./processSearchResults";
import { ReasoningChainArtifact } from "../app/types/reasoning";

export async function executeSearch(query: string): Promise<ProcessedResult[]> {
  const response = await fetch("/api/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to execute search");
  }

  const results = await response.json();
  return results.slice(0, 4);
}

export async function executeSummarize(
  query: string,
  searchResults: ProcessedResult[],
  taskId: number,
  setArtifacts: React.Dispatch<React.SetStateAction<ReasoningChainArtifact[]>>
): Promise<string> {
  const response = await fetch("/api/summarize", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, sources: searchResults }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to execute summarization");
  }

  const reader = response.body?.getReader();
  if (!reader) throw new Error("Failed to get response body reader");

  const decoder = new TextDecoder();
  let summary = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const chunk = decoder.decode(value, { stream: true });
    summary += chunk;

    setArtifacts((prev) => {
      const lastArtifact = prev[prev.length - 1];
      if (lastArtifact?.taskType === "summarize") {
        return [...prev.slice(0, -1), { ...lastArtifact, artifact: summary }];
      }
      return [
        ...prev,
        {
          taskId,
          taskType: "summarize",
          artifact: summary,
        },
      ];
    });
  }

  return summary;
}
