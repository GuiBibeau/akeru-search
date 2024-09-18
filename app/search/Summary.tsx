"use client";

import { useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SearchContext } from "./searchProvider";

export function Summary() {
  const searchContext = useContext(SearchContext);
  if (!searchContext)
    throw new Error("Summary must be used within a SearchProvider");

  const { isLoadingSummary, displayedWords } = searchContext;

  // Hide the summary if not loading and no words to display
  if (!isLoadingSummary && displayedWords.length === 0) {
    return null;
  }

  return (
    <div className="w-full mb-4 mt-4">
      {isLoadingSummary ? (
        <div className="flex justify-center items-center h-16">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-gray-300"></div>
        </div>
      ) : (
        <p className="text-base text-gray-300">
          <AnimatePresence mode="popLayout">
            {displayedWords.map((word, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.1 }}
                className="inline-block mr-1"
              >
                {word}
              </motion.span>
            ))}
          </AnimatePresence>
        </p>
      )}
    </div>
  );
}
