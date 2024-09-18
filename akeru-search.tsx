"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

export default function Component() {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [summary, setSummary] = useState("");
  const searchInputRef = useRef(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    setSearchResults([]);
    setSummary("");

    const encodedQuery = encodeURIComponent(query);
    // Updated URL to use localhost:8080
    const response = await fetch(
      `http://localhost:8080/search?q=${encodedQuery}&stream=true`
    );
    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    let buffer = "";
    let jsonStarted = false;
    let summaryStarted = false;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      while (buffer.includes("\n")) {
        const lineEndIndex = buffer.indexOf("\n");
        const line = buffer.slice(0, lineEndIndex).trim();
        buffer = buffer.slice(lineEndIndex + 1);

        if (line === "START_JSON") {
          jsonStarted = true;
          continue;
        }

        if (line === "END_JSON") {
          jsonStarted = false;
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
            setSearchResults((prevResults) => [...prevResults, ...jsonData]);
          } catch (error) {
            console.error("Error parsing JSON:", error);
          }
        }

        if (summaryStarted) {
          setSummary((prevSummary) => prevSummary + line + "\n");
        }
      }
    }

    setIsSearching(false);
  };

  useEffect(() => {
    if (isSearching) {
      searchInputRef.current.blur();
    }
  }, [isSearching]);

  return (
    <div className="min-h-screen bg-black-100 flex flex-col items-center p-4">
      <motion.div
        initial={false}
        animate={{
          top: isSearching ? "1rem" : "40%",
          width: isSearching ? "100%" : "80%",
          maxWidth: isSearching ? "800px" : "600px",
        }}
        transition={{ duration: 0.5 }}
        className="fixed left-1/2 transform -translate-x-1/2 w-full max-w-2xl px-4"
      >
        <form onSubmit={handleSearch} className="relative">
          <Input
            ref={searchInputRef}
            type="text"
            placeholder="Ask anything..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full py-3 pl-4 pr-12 text-lg rounded-full shadow-lg"
          />
          <Button
            type="submit"
            size="icon"
            className="absolute right-2 top-1/2 transform -translate-y-1/2"
          >
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>
        </form>
      </motion.div>

      <AnimatePresence>
        {isSearching && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mt-24 w-full max-w-4xl"
          >
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Sources</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {searchResults.map((result, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="text-lg">{result.title}</CardTitle>
                      <CardDescription>{result.source}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600">{result.summary}</p>
                      <a
                        href={result.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline mt-2 inline-block"
                      >
                        Read more
                      </a>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-4">Summary</h2>
              <Card>
                <CardContent>
                  <p className="whitespace-pre-wrap">{summary}</p>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
