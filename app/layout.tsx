import type { Metadata } from "next";
import { Exo_2 } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { NavBar } from "@/components/NavBar";

const exo2 = Exo_2({
  subsets: ["latin"],
  variable: "--font-exo2",
});

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Akeru",
  description:
    "Discover our decentralized LLM search engine for comprehensive, instant insights on any topic.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${exo2.variable} ${geistSans.variable} ${geistMono.variable} font-sans antialiased bg-white text-black`}
      >
        <div className="min-h-screen flex flex-col">
          <NavBar />
          {children}
        </div>
        <Analytics />
      </body>
    </html>
  );
}
