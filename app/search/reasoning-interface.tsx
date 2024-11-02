"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Search,
  FileText,
  Loader2,
  CheckCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { TaskPlan } from "../types";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

interface ReasoningInterfaceProps {
  reasoningData: TaskPlan;
  currentStep: number;
  isProcessing: boolean;
  onStart: () => void;
}

export default function ReasoningInterface({
  reasoningData,
  currentStep,
  isProcessing,
}: ReasoningInterfaceProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (currentStep >= reasoningData.steps.length - 1 && !isProcessing) {
      setIsComplete(true);
      setIsExpanded(false);
    }
  }, [currentStep, isProcessing, reasoningData.steps.length]);

  const getStepIcon = (type: string) => {
    switch (type) {
      case "search":
        return <Search className="w-3 h-3" />;
      case "summarize":
        return <FileText className="w-3 h-3" />;
      default:
        return null;
    }
  };

  return (
    <Card className="w-full max-w-xl">
      <CardHeader className="py-3">
        <CardTitle className="text-base flex items-center justify-between">
          <AnimatePresence mode="wait">
            {isProcessing ? (
              <motion.div
                key="thinking"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-1"
              >
                Thinking
                <Loader2 className="w-3 h-3 animate-spin" />
              </motion.div>
            ) : (
              <motion.div
                key="complete"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-1 text-green-500"
              >
                {isComplete ? "Steps completed" : "Complete"}
                <CheckCircle className="w-3 h-3" />
              </motion.div>
            )}
          </AnimatePresence>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            aria-label={isExpanded ? "Collapse steps" : "Expand steps"}
          >
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </Button>
        </CardTitle>
      </CardHeader>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <CardContent className="py-3">
              <div className="space-y-2">
                {reasoningData.steps.map((step, index) => (
                  <Card
                    key={step.id}
                    className={`transition-all duration-300 ${
                      index <= currentStep ? "opacity-100" : "opacity-50"
                    }`}
                  >
                    <CardContent className="p-3 flex items-center space-x-3">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          index < currentStep
                            ? "bg-green-500"
                            : index === currentStep && isProcessing
                            ? "bg-blue-500"
                            : "bg-gray-300"
                        }`}
                      >
                        {index < currentStep ? (
                          <span
                            className="text-white text-sm"
                            aria-hidden="true"
                          >
                            ✓
                          </span>
                        ) : index === currentStep && isProcessing ? (
                          <Loader2
                            className="w-3 h-3 text-white animate-spin"
                            aria-hidden="true"
                          />
                        ) : (
                          getStepIcon(step.action.type)
                        )}
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm">
                          {step.description}
                        </h4>
                        <p className="text-xs text-gray-500">
                          Action: {step.action.type}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
