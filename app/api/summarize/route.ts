import { SummaryTool } from "@/lib/SummaryTool";
import { ProcessedResult } from "@/lib/processSearchResults";
import { llama3point1Groq } from "@/chat-models/llama-3-point-1";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { query, sources } = body as {
      query: string;
      sources: ProcessedResult[];
    };

    if (!query || !sources) {
      return Response.json(
        { error: "Query and sources are required" },
        { status: 400 }
      );
    }

    const summaryTool = new SummaryTool(llama3point1Groq);
    const stream = summaryTool.summarizeWithResultsStreamed(query, sources);

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            controller.enqueue(encoder.encode(chunk.toString()));
          }
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error) {
    console.error("Error in summarize POST endpoint:", error);
    return Response.json(
      { error: "Failed to process summary request" },
      { status: 500 }
    );
  }
}
