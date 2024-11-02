import { NavBar } from "@/components/NavBar";
import { SearchBar } from "./SearchBar";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Akeru Search",
  description: "Living Knowledge: AI-powered search to discover the unknown",
  openGraph: {
    title: "Akeru Search",
    description: "Living Knowledge: AI-powered search to discover the unknown",
    images: [
      {
        url: "https://www.akeru.ai/api/og",
        width: 1200,
        height: 630,
        alt: "Akeru Search OG Image",
      },
    ],
    type: "website",
    url: "https://www.akeru.ai",
  },
  twitter: {
    card: "summary_large_image",
    title: "Akeru Search",
    description: "Living Knowledge: AI-powered search to discover the unknown",
    images: ["https://www.akeru.ai/api/og"],
    creator: "@AkeruAI",
  },
};

export default async function Home() {
  return (
    <div className="min-h-screen flex flex-col relative">
      <div className="relative flex flex-col min-h-screen">
        <NavBar />
        <div className="flex-grow flex flex-col items-center justify-center p-4">
          <SearchBar />
        </div>
      </div>
    </div>
  );
}
