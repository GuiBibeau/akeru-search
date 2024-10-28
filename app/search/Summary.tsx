"use client";

import { ProcessedResult } from "../lib/processSearchResults";
import { useEffect, useState } from "react";

type Props = {
  sources: ProcessedResult[];
  query: string;
};

export const Summary: React.FC<Props> = ({ sources, query }) => {
  const [summary, setSummary] = useState<string>("");

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await fetch("/api/summarize", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query, sources }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error("Failed to get response body reader");
        }

        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          setSummary((prev) => prev + chunk);
        }
      } catch (error) {
        console.error("Error fetching summary:", error);
      }
    };

    if (query && sources.length > 0) {
      fetchSummary();
    }
  }, [query, sources]);

  return (
    <div className="mt-8  bg-black-800">
      <div className="text-gray-200 ">{summary}</div>
    </div>
  );
};
