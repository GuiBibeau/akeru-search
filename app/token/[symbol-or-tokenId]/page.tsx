import { CryptoTokenInfoTool } from "@/lib/crypto-token-info-tool";
import { NewsTool } from "@/lib/news-tool";
import { notFound } from "next/navigation";
// import { TokenPriceChart } from "./price-chart";
// import { TokenPriceChartSkeleton } from "./price-chart-skeleton";
// import { Suspense } from "react";

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

  const newsTool = new NewsTool();
  const news = await newsTool.getNews(name);

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Token Details: {name}</h1>
      {news && <pre>{JSON.stringify(news, null, 2)}</pre>}
      {/* <Suspense fallback={<TokenPriceChartSkeleton />}>
        <TokenPriceChart tokenId={id} name={name} />
      </Suspense> */}
    </main>
  );
}
