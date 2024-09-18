"use client";

import { useContext } from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { SearchContext } from "./searchProvider";
import { FileIcon } from "lucide-react"; // Import icons
import { LinkPreview } from "@/components/ui/link-preview";
import Image from "next/image";

export const experimental_ppr = true;

export function SearchResults() {
  const searchContext = useContext(SearchContext);
  if (!searchContext)
    throw new Error("SearchResults must be used within a SearchProvider");

  const { searchResults, isSearching } = searchContext;

  const renderSkeletons = () => (
    <div className="w-full">
      <h2 className="text-xl font-bold mb-2 text-gray-300">Sources</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(3)].map((_, index) => (
          <Card key={index} className="h-24 bg-black-800 border-gray-700">
            {" "}
            <CardContent className="p-3 flex flex-col">
              <div className="w-1/2 h-3 bg-gray-700 rounded mb-1 animate-pulse"></div>
              <div className="w-3/4 h-2 bg-gray-700 rounded mb-2 animate-pulse"></div>
              <div className="flex-grow space-y-1">
                <div className="w-full h-2 bg-gray-700 rounded animate-pulse"></div>
                <div className="w-full h-2 bg-gray-700 rounded animate-pulse"></div>
              </div>
              <div className="flex justify-end mt-2">
                <div className="w-1/4 h-2 bg-gray-700 rounded animate-pulse"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  if (isSearching && searchResults.length === 0) {
    return renderSkeletons();
  }

  if (!isSearching && searchResults.length === 0) {
    return null;
  }

  return (
    <div className="w-full">
      <h2 className="text-xl font-bold mb-2 text-gray-300">Sources</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {searchResults.map((result, index) => (
          <a
            key={index}
            href={result.url}
            target="_blank"
            rel="noopener noreferrer"
            className="no-underline"
          >
            <LinkPreview
              url={result.url}
              className="font-bold bg-clip-text text-transparent bg-gradient-to-br from-purple-500 to-pink-500"
            >
              <Card className="bg-black-800 border-gray-700 hover:bg-black-700 transition-colors duration-200 h-24 flex flex-col relative">
                <CardContent className="p-3 flex flex-col flex-grow">
                  {result.icon ? (
                    <Image
                      src={result.icon}
                      alt="Icon"
                      width={16}
                      height={16}
                      className="absolute top-2 right-2 w-4 h-4"
                    />
                  ) : (
                    <FileIcon className="absolute top-2 right-2 w-4 h-4 text-gray-400" />
                  )}
                  <CardTitle className="text-xs text-gray-200 mb-1 line-clamp-1">
                    {result.title}
                  </CardTitle>
                  <div className="text-xs text-gray-400 mb-1 truncate">
                    <span>{result.source}</span> • <span>{result.date}</span>
                  </div>
                  <p className="text-xs text-gray-300 line-clamp-2">
                    {result.summary.replace(/<[^>]*>/g, "")}
                  </p>
                </CardContent>
              </Card>
            </LinkPreview>
          </a>
        ))}
      </div>
    </div>
  );
}
