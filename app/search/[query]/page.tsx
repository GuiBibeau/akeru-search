import { createStringFromParam } from "@/lib/create-param-from-string";
import { processSearchResults } from "@/lib/processSearchResults";
import { SearchTool } from "@/lib/SearchTool";
import { Metadata } from "next";
import { Sources } from "./sources";
import { StreamingSummary } from "./streaming-summary";

export const metadata: Metadata = {
  title: "Prototype Page",
  description: "A basic Next.js prototype page",
};

export default async function PrototypePage(props: {
  params: Promise<{ query?: string }>;
}) {
  const params = await props.params;
  const query = params.query;
  const searchPrompt = createStringFromParam(query!);

  const searchTool = new SearchTool();
  const searchResults = await searchTool.search(searchPrompt!);
  const processedResults = processSearchResults(searchResults!);

  return (
    <>
      <Sources sources={processedResults.slice(0, 4)} />
      <StreamingSummary query={searchPrompt} sources={processedResults} />
    </>
  );
}
