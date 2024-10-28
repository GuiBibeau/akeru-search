import { llama3point1Groq } from "../../chat-models/llama-3-point-1";
import { processSearchResults, SearchResult } from "./processSearchResults";
import { gpt3point5 } from "../../chat-models/gpt-3.5";
import { SearchTool } from "./SearchTool";

export class SummaryTool {
  private model;
  private searchTool: SearchTool;

  constructor(
    model: typeof llama3point1Groq | typeof gpt3point5 = llama3point1Groq
  ) {
    this.model = model;
    this.searchTool = new SearchTool("BraveSearch");
  }

  private createPrompt(
    query: string,
    searchResults: SearchResult[]
  ): [string, string][] {
    const resultsWithoutIconsAndThumbnails = searchResults.map(
      ({ icon, thumbnailSrc, ...rest }) => rest
    );
    return [
      [
        "system",
        "You are an expert at summarizing search results and providing informative answers. Respond with a comprehensive answer to the user's query, synthesizing information from multiple sources when applicable. Provide only the text summary without any formatting or mention of an assistant.",
      ],
      [
        "human",
        `The user's query was: "${query}". Here are the search results: ${JSON.stringify(
          resultsWithoutIconsAndThumbnails
        )}. 

Provide a comprehensive answer to the user's query, addressing the main points and synthesizing information from multiple sources when applicable. Respond with only the text summary, without any additional formatting or structure.`,
      ],
    ];
  }

  async *summarizeStream(query: string): AsyncGenerator<string, void, unknown> {
    const processedResults = await this.getProcessedResults(query);
    const results = processedResults.slice(0, 3);

    yield "START_JSON\n";
    yield JSON.stringify(results);
    yield "\nEND_JSON\n";

    yield "START_SUMMARY\n";
    const stream = await this.model.stream(this.createPrompt(query, results));

    for await (const chunk of stream) {
      yield chunk.content;
    }
    yield "\nEND_SUMMARY";
  }

  async summarize(query: string): Promise<string> {
    try {
      const processedResults = await this.getProcessedResults(query);
      const top3Results = processedResults.slice(0, 3);
      const response = await this.model.invoke(
        this.createPrompt(query, top3Results)
      );

      const result = {
        top3Results: top3Results,
        summary: response.content,
      };

      return JSON.stringify(result);
    } catch (error) {
      console.error("Error in summarize method:", error);
      throw error;
    }
  }

  private async getProcessedResults(query: string) {
    const searchResults = await this.searchTool.search(query);
    return processSearchResults(searchResults!);
  }
}
