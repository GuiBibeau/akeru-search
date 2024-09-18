"use client";

import { useContext } from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { SearchContext } from "./searchProvider";

export const experimental_ppr = true;

export function SearchResults() {
  const searchContext = useContext(SearchContext);
  if (!searchContext)
    throw new Error("SearchResults must be used within a SearchProvider");

  const { searchResults } = searchContext;

  // Add this condition to hide results when empty
  if (searchResults.length === 0) {
    return null;
  }

  return (
    <div className="w-full">
      <h2 className="text-xl font-bold mb-2 text-gray-300">Sources</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {searchResults.map((result, index) => (
          <a
            key={index}
            href={result.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block h-full"
          >
            <Card className="bg-black-800 border-gray-700 hover:bg-black-700 transition-colors duration-200 h-full flex flex-col">
              <CardContent className="p-4 flex flex-col flex-grow">
                <CardTitle className="text-sm text-gray-200 mb-2 line-clamp-2">
                  {result.title}
                </CardTitle>
                <span className="text-blue-400 hover:text-blue-300 text-xs inline-block mt-auto">
                  Read more
                </span>
              </CardContent>
            </Card>
          </a>
        ))}
      </div>
    </div>
  );
}
