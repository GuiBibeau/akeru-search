import Link from "next/link";
import { redirect } from "next/navigation";
import { track } from "@vercel/analytics/server";
import { SearchForm } from "./search-form";
import { createParamFromString } from "@/lib/create-param-from-string";

async function searchAction(formData: FormData) {
  "use server";
  const query = formData.get("query")?.toString();
  if (query?.trim()) {
    track("search", { query });
    redirect(`/search/${createParamFromString(query)}`);
  }
}

export function SearchBar() {
  return (
    <div className="fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl px-4">
      <h1 className="text-4xl font-bold mb-8 text-center">
        Experience open source AI search.
      </h1>
      <SearchForm searchAction={searchAction} />
      <div className="flex justify-center space-x-2 mt-4 flex-wrap gap-2">
        <TokenPill emoji="💰" token="SOL" text="What's the latest on Solana?" />
        <TokenPill emoji="₿" token="BTC" text="What's the latest on Bitcoin?" />
        <SearchPill emoji="🔍" query="What is web3?" />
      </div>

      <p className="text-center text-sm text-gray-500 mt-4">
        Powered by open source infrastructure for truly private,
        censorship-resistant search
      </p>
    </div>
  );
}

function SearchPill({ emoji, query }: { emoji: string; query: string }) {
  return (
    <Link
      href={`/search/${createParamFromString(query)}`}
      className="border hover:bg-gray-100 transition-all duration-300 ease-in-out px-4 py-2 rounded-lg text-sm inline-flex items-center"
    >
      {emoji} {query}
    </Link>
  );
}

function TokenPill({
  emoji,
  token,
  text,
}: {
  emoji: string;
  token: string;
  text?: string;
}) {
  return (
    <Link
      href={`/token/${createParamFromString(token)}`}
      className="border hover:bg-gray-100 transition-all duration-300 ease-in-out px-4 py-2 rounded-lg text-sm inline-flex items-center"
    >
      {emoji} {text || token}
    </Link>
  );
}
