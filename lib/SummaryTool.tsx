import { ProcessedResult, processSearchResults } from "./processSearchResults";
import { gpt3point5 } from "../chat-models/gpt-3.5";
import { SearchTool } from "./SearchTool";
import { llama3point2 } from "@/chat-models/llama-3-point-1";

export class SummaryTool {
  private model;
  private searchTool: SearchTool;

  constructor(model: typeof llama3point2 | typeof gpt3point5 = llama3point2) {
    this.model = model;
    this.searchTool = new SearchTool();
  }

  private createPrompt(
    query: string,
    searchResults: ProcessedResult[]
  ): [string, string][] {
    const resultsWithoutIconsAndThumbnails = searchResults.map(
      (searchResult) => ({
        title: searchResult.title,
        source: searchResult.source,
        date: searchResult.date,
        summary: searchResult.summary,
        keyPoints: searchResult.keyPoints,
        url: searchResult.url,
      })
    );
    return [
      [
        "system",
        `Use the folowing step-by-step instructions to respond to the user's inputs.
        
        step 1 - The user will provide you with a search query and a list of search results.
        step 2 - Understand the user's query and the information they are looking for.
        step 3 - Synthesize the information in 4 to 6 sentences from the search results to provide a comprehensive answer to the user's query.
        step 4 - Use only plain text without any markdown or formatting, never mention the user.
        `,
      ],
      [
        "human",
        `
        query: ${query}
        search results: ${JSON.stringify(
          resultsWithoutIconsAndThumbnails.slice(0, 4)
        )}.`,
      ],
    ];
  }

  async summarizeWithResults(query: string, searchResults: ProcessedResult[]) {
    try {
      const top3Results = searchResults.slice(0, 3);
      const response = await this.model.invoke(
        this.createPrompt(query, top3Results)
      );

      return response.content;
    } catch (error) {
      console.error("Error in summarizeWithResults method:", error);
      throw error;
    }
  }

  async *summarizeWithResultsStreamed(
    query: string,
    searchResults: ProcessedResult[]
  ) {
    try {
      const top3Results = searchResults.slice(0, 3);
      const stream = await this.model.stream(
        this.createPrompt(query, top3Results)
      );
      for await (const chunk of stream) {
        yield chunk.content;
      }
    } catch (error) {
      console.error("Error in summarizeWithResultsStreamed method:", error);
      throw error;
    }
  }

  public async getProcessedResults(query: string) {
    const searchResults = await this.searchTool.search(query);
    return processSearchResults(searchResults!);
  }
}
