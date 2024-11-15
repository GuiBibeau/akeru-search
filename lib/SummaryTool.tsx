import { ProcessedResult, processSearchResults } from "./processSearchResults";
import { gpt3point5 } from "../chat-models/gpt-3.5";
import { SearchTool } from "./SearchTool";
import { llama3point2 } from "@/chat-models/llama-3-point-1";

export class SummaryTool {
  private model;
  private searchTool: SearchTool;

  constructor(model: typeof llama3point2 | typeof gpt3point5 = llama3point2) {
    this.model = model;
    this.searchTool = new SearchTool("BraveSearch");
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
        "You are a search engine assistant that summarizes search results and provides informative answers. You will be given a user's query and a list of search results. Your task is to provide a comprehensive answer to the user's query, synthesizing information from multiple sources when applicable. Use only plain text without any markdown or formatting.",
      ],
      [
        "human",
        `I am searching for "${query}". Here are the search results: ${JSON.stringify(
          resultsWithoutIconsAndThumbnails
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
