import { NavBar } from "@/components/NavBar";
import { Sources } from "./Sources.server";
import { SummaryTool } from "../lib/SummaryTool";
import { llama3point1Groq } from "@/chat-models/llama-3-point-1";
import { Summary } from "./Summary";
import { Suspense } from "react";
import { SourcesSkeleton } from "./SourcesSkeleton";

export default async function Home(props: {
  searchParams: Promise<{ q?: string }>;
}) {
  const searchParams = await props.searchParams;
  const initialQuery = searchParams.q || "";

  const summaryTool = new SummaryTool(llama3point1Groq);
  const sources = await summaryTool.getProcessedResults(initialQuery);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <NavBar />
      <div className="flex-grow flex justify-center p-4">
        <div className="w-full max-w-3xl flex flex-col items-center">
          <div className="w-full flex flex-col items-start">
            <h1 className="text-3xl font-bold text-gray-300">{initialQuery}</h1>
          </div>
          <div className="mt-6 w-full flex flex-col">
            <Suspense fallback={<SourcesSkeleton />}>
              <Sources sources={sources.slice(0, 3)} />
            </Suspense>
            <Summary sources={sources} query={initialQuery} />
          </div>
        </div>
      </div>
    </div>
  );
}
