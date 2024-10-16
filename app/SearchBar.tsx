import Link from "next/link";
import { redirect } from "next/navigation";
import { track } from "@vercel/analytics/server";
import { SearchForm } from "./SearchForm";

async function searchAction(formData: FormData) {
  "use server";
  const query = formData.get("query")?.toString();
  if (query?.trim()) {
    track("search", { query });
    redirect(`/search?q=${encodeURIComponent(query)}`);
  }
}

export function SearchBar() {
  return (
    <div className="fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl px-4">
      <h1 className="text-4xl font-bold mb-8 text-white text-center">
        Your journey starts with a question. What&apos;s yours?
      </h1>
      <SearchForm searchAction={searchAction} />
      <div className="flex justify-center space-x-2">
        <SearchPill emoji="🌍" query="World history" />
        <SearchPill emoji="🧬" query="Biology basics" />
        <SearchPill emoji="🔢" query="Math formulas" />
        <SearchPill emoji="🎨" query="Art techniques" />
      </div>
    </div>
  );
}

function SearchPill({ emoji, query }: { emoji: string; query: string }) {
  return (
    <Link
      href={`/search?q=${encodeURIComponent(query)}`}
      className="bg-black text-white border border-white/50 hover:bg-white/10 hover:text-white transition-all duration-300 ease-in-out px-4 py-2 rounded-lg text-sm inline-flex items-center"
    >
      {emoji} {query}
    </Link>
  );
}
