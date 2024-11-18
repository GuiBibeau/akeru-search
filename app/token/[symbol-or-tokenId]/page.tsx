import { CryptoTokenInfoTool } from "@/lib/crypto-token-info-tool";
import { NewsTool } from "@/lib/news-tool";
import { notFound } from "next/navigation";
import { LatestNews } from "./latest-news";
import { TokenPriceChart } from "./price-chart";
import { SearchTool } from "@/lib/SearchTool";
import { processSearchResults } from "@/lib/processSearchResults";
import { ServerSummary } from "./server-summary";
import top10TokenPaths from "@/top10-tokens-paths.json";
import { Metadata } from "next";

export async function generateStaticParams() {
  return top10TokenPaths.map((path) => ({
    "symbol-or-tokenId": path,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ "symbol-or-tokenId"?: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const symbolOrTokenId = resolvedParams["symbol-or-tokenId"];
  const cryptoTokenInfoTool = new CryptoTokenInfoTool();
  const token = cryptoTokenInfoTool.getTokenFromSymbolNameOrId(
    symbolOrTokenId!
  );

  if (!token) {
    return {
      title: "Token Not Found - Finder",
      description: "The requested token could not be found.",
    };
  }

  const { name } = token;
  const title = `${name} Analysis - Finder`;
  const description = `Get detailed analysis, price charts, and latest news for ${name}. Make informed investment decisions with AI-powered insights.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: "https://www.akeru.ai/api/og",
          width: 1200,
          height: 630,
          alt: `${name} Token Analysis`,
        },
      ],
      type: "website",
      url: `https://www.akeru.ai/token/${symbolOrTokenId}`,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["https://www.akeru.ai/api/og"],
      creator: "@guibibeau",
    },
  };
}

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

  const { name, id } = token;

  const newsTool = new NewsTool();
  const news = await newsTool.getNews(name);
  const searchTool = new SearchTool();
  const searchPrompt = `Is ${name} a good investment?`;

  const searchResults = await searchTool.search(searchPrompt);
  const processedResults = processSearchResults(searchResults!);

  const formattedNews = {
    title: `Latest ${name} News`,
    lastUpdated: Date.now(),
    articles: news!.map((article) => ({
      title: article.title,
      content: article.description,
      url: article.url,
    })),
  };

  return (
    <main className="container mx-auto px-4 py-8 flex gap-8">
      <aside className="hidden lg:block w-64 h-fit sticky top-24 space-y-2">
        <h2 className="font-semibold mb-4">Quick Navigation</h2>
        <nav className="flex flex-col space-y-2">
          <a href="#summary" className="hover:text-blue-500 transition-colors">
            Summary
          </a>
          <a
            href="#latest-news"
            className="hover:text-blue-500 transition-colors"
          >
            Latest News
          </a>
          <a
            href="#price-chart"
            className="hover:text-blue-500 transition-colors"
          >
            Price Chart
          </a>
        </nav>
      </aside>

      <div className="flex-1">
        <h1 className="text-3xl font-bold mb-6">Token Details: {name}</h1>
        <div className="space-y-8">
          <div id="summary">
            <ServerSummary query={searchPrompt} sources={processedResults} />
          </div>
          <div id="latest-news">
            <LatestNews {...formattedNews} />
          </div>
          <div id="price-chart">
            <TokenPriceChart tokenId={id} name={name} />
          </div>
        </div>
      </div>
    </main>
  );
}
