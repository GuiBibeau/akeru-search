import { CryptoTokenInfoTool } from "@/lib/crypto-token-info-tool";
// import { NewsTool } from "@/lib/news-tool";
import { notFound } from "next/navigation";
import { LatestNews } from "./latest-news";

// Mock data for LatestNews component
const mockLatestNews = {
  title: "Latest Cryptocurrency News",
  lastUpdated: Date.now(),
  articles: [
    {
      title: "Major Price Movement Expected",
      content:
        "Analysts predict significant volatility in the coming weeks based on technical indicators and market sentiment.",
      url: "https://example.com/news/1",
    },
    {
      title: "New Partnership Announced",
      content:
        "Strategic collaboration with leading tech firms to enhance blockchain infrastructure and scalability.",
      url: "https://example.com/news/2",
    },
    {
      title: "Regulatory Updates",
      content:
        "Recent developments in cryptocurrency regulations across major markets signal positive outlook for institutional adoption.",
      url: "https://example.com/news/3",
    },
  ],
};

export default async function TokenPage(props: {
  params: Promise<{ "symbol-or-tokenId"?: string }>;
}) {
  const params = await props.params;
  const symbolOrTokenId = params["symbol-or-tokenId"];

  const cryptoTokenInfoTool = new CryptoTokenInfoTool();
  const token = cryptoTokenInfoTool.getTokenFromSymbolNameOrId(
    symbolOrTokenId!
  );

  if (!token) {
    return notFound();
  }

  const { name } = token;

  // const newsTool = new NewsTool();
  // const news = await .getNews(name);

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Token Details: {name}</h1>
      <div className="space-y-8">
        <LatestNews {...mockLatestNews} />
      </div>
    </main>
  );
}
