import { NavBar } from "@/components/NavBar";
import { SearchProvider } from "./searchProvider";
import { SearchResults } from "./SearchResults";
import { Summary } from "./Summary";

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
        <div className="flex-grow flex justify-center p-4">
          <div className="w-full max-w-3xl flex flex-col items-center">
            <div className="w-full flex flex-col items-start">
              <p className="text-sm text-gray-400 mb-1">
                Powered by{" "}
                <a
                  href="https://www.gaianet.ai/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 font-semibold hover:text-blue-300 hover:underline transition-colors duration-200"
                >
                  Gaia Living Systems
                </a>
              </p>
              <h1 className="text-3xl font-bold text-gray-300">
                {initialQuery}
              </h1>
            </div>
            <div className="mt-6 w-full flex flex-col">
              <SearchResults />
              <Summary />
            </div>
          </div>
        </div>
      </div>
    </SearchProvider>
  );
}
