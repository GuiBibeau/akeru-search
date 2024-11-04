import { NavBar } from "@/components/NavBar";
import { SearchBar } from "./SearchBar";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Finder - Open Source AI Search",
  description:
    "An open source AI-powered search engine for the web3 ecosystem.",
  openGraph: {
    title: "Finder - Open Source AI Search",
    description:
      "An open source AI-powered search engine for the web3 ecosystem.",
    images: [
      {
        url: "https://www.akeru.ai/api/og",
        width: 1200,
        height: 630,
        alt: "Finder Decentralized Search",
      },
    ],
    type: "website",
    url: "https://www.akeru.ai",
  },
  twitter: {
    card: "summary_large_image",
    title: "Finder - Open Source AI Search",
    description:
      "An open source AI-powered search engine for the web3 ecosystem.",
    images: ["https://www.akeru.ai/api/og"],
    creator: "@FinderAI",
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
