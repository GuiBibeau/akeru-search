import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { redirect } from "next/navigation";
import { track } from "@vercel/analytics";

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
        Living Knowledge
      </h1>
      <form action={searchAction} className="relative mb-4">
        <Input
          name="query"
          type="text"
          placeholder="Ask anything..."
          className="w-full py-2 pl-5 pr-14 text-xl rounded-lg shadow-lg bg-black text-white border border-white/50 focus:border-white placeholder-gray-400"
        />
        <Button
          type="submit"
          size="icon"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-transparent text-white font-semibold rounded-lg hover:bg-white/10 hover:text-white transition-all duration-300 ease-in-out"
        >
          <Search className="h-5 w-5 border-none" />
          <span className="sr-only">Search</span>
        </Button>
      </form>
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
