import { NextRequest, NextResponse } from "next/server";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json(
      { error: "Query parameter is required" },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.2-3b-preview",
        messages: [
          {
            role: "system",
            content:
              "You are a search suggestion generator. Provide 5 relevant suggestions as a comma-separated list, without any additional text, formatting, or explanation.",
          },
          {
            role: "user",
            content: `Generate 5 search suggestions for: "${query}"`,
          },
        ],
        temperature: 0.5,
        max_tokens: 150,
        top_p: 1,
        stream: false,
        n: 1,
      }),
    });

    if (!response.ok) {
      throw new Error(`GROQ API responded with status ${response.status}`);
    }

    const data = await response.json();
    const suggestions = data.choices[0].message.content
      .split(",")
      .map((suggestion: string) => suggestion.trim())
      .filter(Boolean)
      .slice(0, 5);

    return NextResponse.json(suggestions);
  } catch (error) {
    console.error("Error generating suggestions:", error);
    return NextResponse.json(
      { error: "Failed to generate suggestions" },
      { status: 500 }
    );
  }
}
