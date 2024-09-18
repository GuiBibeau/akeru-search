import { NavBar } from "@/components/NavBar";
import { SearchProvider } from "./searchProvider";
import { SearchResults } from "./SearchResults";
import { Summary } from "./Summary";

export interface SearchResult {
  url: string;
  title: string;
}

export default async function Home({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const initialQuery = searchParams.q || "";

  return (
    <SearchProvider initialQuery={initialQuery}>
      <div className="min-h-screen bg-black text-white flex flex-col">
        <NavBar />
        <div className="flex-grow flex flex-col items-center p-4">
          <div className="mt-24 w-full max-w-6xl flex flex-col">
            <SearchResults />
            <Summary />
          </div>
        </div>
      </div>
    </SearchProvider>
  );
}
