import { ImageResponse } from "@vercel/og";

export const runtime = "edge";

export async function GET() {
  const exo2 = await fetch(
    new URL(
      "https://fonts.googleapis.com/css2?family=Exo+2:wght@400;700&display=swap",
      import.meta.url
    )
  ).then((res) => res.arrayBuffer());

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 128,
          background: "linear-gradient(to bottom, #4F46E5, #7C3AED)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontFamily: '"Exo 2"',
        }}
      >
        <div style={{ fontSize: 128, fontWeight: "bold" }}>Akeru Search</div>
        <div style={{ fontSize: 48, marginTop: 40 }}>Discover the unknown</div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "Exo 2",
          data: exo2,
          style: "normal",
        },
      ],
    }
  );
}
