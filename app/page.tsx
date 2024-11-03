import { NavBar } from "@/components/NavBar";
import { SearchBar } from "./SearchBar";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Finder - Your Web3 Butler",
  description:
    "Your personal butler for navigating the web3 world with ease. Simply ask, and let Finder handle your web3 life and investments.",
  openGraph: {
    title: "Finder - Your Web3 Butler",
    description:
      "Your personal butler for navigating the web3 world with ease. Simply ask, and let Finder handle your web3 life and investments.",
    images: [
      {
        url: "https://www.finder.ai/api/og",
        width: 1200,
        height: 630,
        alt: "Finder Web3 Butler OG Image",
      },
    ],
    type: "website",
    url: "https://www.finder.ai",
  },
  twitter: {
    card: "summary_large_image",
    title: "Finder - Your Web3 Butler",
    description:
      "Your personal butler for navigating the web3 world with ease. Simply ask, and let Finder handle your web3 life and investments.",
    images: ["https://www.finder.ai/api/og"],
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
