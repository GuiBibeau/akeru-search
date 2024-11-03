"use client";

import { useReasoningContext } from "../../hooks/reasoning-context";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const StreamingSummary = () => {
  const { artifacts, queueItems } = useReasoningContext();
  const [words, setWords] = useState<string[]>([]);

  useEffect(() => {
    const summaryArtifact = artifacts
      .filter((a) => a.taskType === "summarize")
      .pop();

    if (summaryArtifact) {
      const newWords = summaryArtifact.artifact.split(/\s+/);
      setWords(newWords);
    }
  }, [artifacts]);

  const isProcessingSummary = queueItems.some(
    (item) =>
      item.status === "processing" && item.task.action.type === "summarize"
  );

  if (!words.length && !isProcessingSummary) {
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
            {isProcessingSummary ? (
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
      </CardContent>
    </Card>
  );
};
