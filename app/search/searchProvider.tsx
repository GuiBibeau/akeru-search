"use client";

import { SearchResult } from "@/app/page";
import React, {
  createContext,
  useState,
  useEffect,
  useRef,
  FormEvent,
} from "react";
import { useRouter } from "next/navigation";

interface SearchContextType {
  query: string;
  setQuery: (query: string) => void;
  isSearching: boolean;
  setIsSearching: (isSearching: boolean) => void;
  searchResults: SearchResult[];
  setSearchResults: (results: SearchResult[]) => void;
  isLoadingResults: boolean;
  setIsLoadingResults: (isLoading: boolean) => void;
  summaryWords: string[];
  setSummaryWords: (words: string[]) => void;
  displayedWords: string[];
  setDisplayedWords: (words: string[]) => void;
  isLoadingSummary: boolean;
  setIsLoadingSummary: (isLoading: boolean) => void;
  handleSearch: (e: FormEvent<HTMLFormElement>) => Promise<void>;
}

export const SearchContext = createContext<SearchContextType | undefined>(
  undefined
);

export function SearchProvider({
  children,
  initialQuery = "",
}: {
  children: React.ReactNode;
  initialQuery?: string;
}) {
  const [query, setQuery] = useState<string>(initialQuery);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoadingResults, setIsLoadingResults] = useState<boolean>(false);
  const [summaryWords, setSummaryWords] = useState<string[]>([]);
  const [displayedWords, setDisplayedWords] = useState<string[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isLoadingSummary, setIsLoadingSummary] = useState<boolean>(false);
  const router = useRouter();

  // Add this new useEffect hook
  useEffect(() => {
    if (initialQuery.trim()) {
      setQuery(initialQuery);
      handleSearch({ preventDefault: () => {} } as FormEvent<HTMLFormElement>);
    }
  }, []);

  const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!query.trim()) return;

    // Update the URL with the search query
    router.push(`/search?q=${encodeURIComponent(query)}`, { scroll: false });

    setIsSearching(true);
    setIsLoadingResults(true);
    setIsLoadingSummary(true);
    setSearchResults([]);
    setSummaryWords([]);
    setDisplayedWords([]);

    const encodedQuery = encodeURIComponent(query);
    const response = await fetch(`/api/search?q=${encodedQuery}`);
    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error("Failed to get response body reader");
    }
    const decoder = new TextDecoder();

    let buffer = "";
    let jsonStarted = false;
    let summaryStarted = false;
    let summaryWordsFound = false;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      while (buffer.includes("\n")) {
        const lineEndIndex = buffer.indexOf("\n");
        const line = buffer.slice(0, lineEndIndex);
        buffer = buffer.slice(lineEndIndex + 1);

        if (line === "START_JSON") {
          jsonStarted = true;
          continue;
        }

        if (line === "END_JSON") {
          jsonStarted = false;
          setIsLoadingResults(false);
          continue;
        }

        if (line === "START_SUMMARY") {
          summaryStarted = true;
          continue;
        }

        if (line === "END_SUMMARY") {
          summaryStarted = false;
          continue;
        }

        if (jsonStarted) {
          try {
            const jsonData = JSON.parse(line);
            setSearchResults((prevResults) => {
              const newResults = [...prevResults, ...jsonData];
              return newResults.slice(0, 3); // Limit to 3 results
            });
          } catch (error) {
            console.error("Error parsing JSON:", error);
          }
        }

        if (summaryStarted) {
          if (line.trim() !== "" && !summaryWordsFound) {
            summaryWordsFound = true;
            setIsLoadingSummary(false);
          }
          setSummaryWords((prevWords) => [...prevWords, line]);
        }
      }
    }

    setIsLoadingResults(false);
  };

  useEffect(() => {
    if (
      summaryWords.length > 0 &&
      displayedWords.length < summaryWords.length
    ) {
      intervalRef.current = setInterval(() => {
        setDisplayedWords((prev) => {
          const nextWords = summaryWords.slice(0, prev.length + 3);
          if (nextWords.length === summaryWords.length) {
            clearInterval(intervalRef.current as NodeJS.Timeout);
          }
          return nextWords;
        });
      }, 20);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [summaryWords, displayedWords]);

  return (
    <SearchContext.Provider
      value={{
        query,
        setQuery,
        isSearching,
        setIsSearching,
        searchResults,
        setSearchResults,
        isLoadingResults,
        setIsLoadingResults,
        summaryWords,
        setSummaryWords,
        displayedWords,
        setDisplayedWords,
        isLoadingSummary,
        setIsLoadingSummary,
        handleSearch,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}
