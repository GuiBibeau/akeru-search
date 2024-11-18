"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProcessedResult } from "@/lib/processSearchResults";

interface StreamingSummaryProps {
  query: string;
  sources: ProcessedResult[];
}

export const StreamingSummary = ({ query, sources }: StreamingSummaryProps) => {
  const [words, setWords] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setIsProcessing(true);
        setError(null);

        const response = await fetch("/api/summarize", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query, sources }),
        });

        if (!response.ok) {
          throw new Error("Failed to generate summary");
        }

        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error("No response body");
        }

        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            break;
          }

          const text = new TextDecoder().decode(value);
          const newWords = text.split(/\s+/);
          setWords((prev) => [...prev, ...newWords]);
        }

        setIsProcessing(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        setIsProcessing(false);
      }
    };

    if (query && sources.length > 0) {
      fetchSummary();
    }
  }, [query, sources]);

  if (!words.length && !isProcessing) {
    return null;
  }

  return (
    <Card className="w-full mt-10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <FileText className="w-5 h-5" />
          Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <AnimatePresence mode="wait">
            {isProcessing ? (
              <motion.div
                key="generating"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Badge variant="secondary" className="text-sm font-medium">
                  <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                  Generating
                </Badge>
              </motion.div>
            ) : (
              <motion.div
                key="complete"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <Badge variant="secondary" className="text-sm font-medium">
                  Complete
                </Badge>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {error ? (
          <div className="text-red-500 text-sm">{error}</div>
        ) : (
          <motion.div className="prose max-w-none text-primary">
            <AnimatePresence mode="popLayout">
              {words.map((word, index) => (
                <motion.span
                  key={`${word}-${index}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="inline-block mr-1"
                >
                  {word}
                </motion.span>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};
