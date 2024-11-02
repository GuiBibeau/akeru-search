import { SearchTool } from "@/app/lib/SearchTool";
import {
  ProcessedResult,
  processSearchResults,
} from "@/app/lib/processSearchResults";

interface SearchRequestBody {
  query: string;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { query } = body as SearchRequestBody;

    if (!query) {
      return Response.json({ error: "Query is required" }, { status: 400 });
    }

    const searchTool = new SearchTool("BraveSearch");
    const searchResults = await searchTool.search(query);

    if (!searchResults) {
      return Response.json(
        { error: "No search results found" },
        { status: 404 }
      );
    }

    const processedResults: ProcessedResult[] =
      processSearchResults(searchResults);
    return Response.json(processedResults);
  } catch (error) {
    console.error("Error in search POST endpoint:", error);
    return Response.json(
      { error: "Failed to process search request" },
      { status: 500 }
    );
  }
}
