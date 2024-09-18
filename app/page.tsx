import { NavBar } from "@/components/NavBar";
import { SearchBar } from "./SearchBar";
import Image from "next/image";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Akeru Search",
  description: "Discover the unknown with Akeru Search",
  openGraph: {
    title: "Akeru Search",
    description: "Discover the unknown with Akeru Search",
    images: [
      {
        url: "https://yourdomain.com/api/og",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Akeru Search",
    description: "Discover the unknown with Akeru Search",
    images: ["https://yourdomain.com/api/og"],
  },
};

export default async function Home() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col relative">
      <Image
        src="/background-hero.jpg"
        alt="a stary field"
        layout="fill"
        objectFit="cover"
        quality={100}
        priority
        className="z-0"
      />
      <div className="relative z-10 flex flex-col min-h-screen">
        <NavBar />
        <div className="flex-grow flex flex-col items-center justify-center p-4">
          <SearchBar />
        </div>
      </div>
    </div>
  );
}
