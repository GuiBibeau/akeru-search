import { FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProcessedResult } from "@/lib/processSearchResults";
import { SummaryTool } from "@/lib/SummaryTool";
import { llama3point2 } from "@/chat-models/llama-3-point-1";

interface ServerSummaryProps {
  query: string;
  sources: ProcessedResult[];
}

export async function ServerSummary({ query, sources }: ServerSummaryProps) {
  if (!query || sources.length === 0) {
    return null;
  }

  const summaryTool = new SummaryTool(llama3point2);
  const content = await summaryTool.summarizeWithResults(query, sources);

  return (
    <Card className="w-full mt-10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <FileText className="w-5 h-5" />
          Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="prose max-w-none text-primary">{String(content)}</div>
      </CardContent>
    </Card>
  );
}
