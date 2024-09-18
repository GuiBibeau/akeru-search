import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q");
  console.log("query", query);

  if (!query) {
    return NextResponse.json(
      { error: "Query parameter is required" },
      { status: 400 }
    );
  }

  const encodedQuery = encodeURIComponent(query);
  const response = await fetch(
    `http://localhost:8080/search?q=${encodedQuery}&stream=true`,
    {
      headers: {
        Authorization: `Bearer ${process.env.AGENTS_API_KEY}`,
      },
    }
  );

  return new NextResponse(response.body);
}
