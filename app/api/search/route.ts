import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json(
      { error: "Query parameter is required" },
      { status: 400 }
    );
  }

  const encodedQuery = encodeURIComponent(query);
  const apiBaseUrl = process.env.API_BASE_URL;
  const response = await fetch(
    `${apiBaseUrl}/search?q=${encodedQuery}&stream=true`,
    {
      headers: {
        Authorization: `Bearer ${process.env.AGENTS_API_KEY}`,
      },
    }
  );

  return new NextResponse(response.body);
}
