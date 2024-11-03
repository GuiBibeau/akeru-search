"use client";

import { useReasoningContext } from "./reasoning-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HelpCircle } from "lucide-react";

export const RequestInformation = () => {
  const { queueItems } = useReasoningContext();

  // Find if there's a current step that requires information
  const currentRequestStep = queueItems.find(
    (item) =>
      item.status === "processing" && item.task.action.type === "requestInfo"
  );

  if (!currentRequestStep) {
    return null;
  }

  return (
    <Card className="w-full mt-10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <HelpCircle className="w-5 h-5" />
          Information Needed
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="prose max-w-none text-primary">
          <p>{currentRequestStep.task.action.params.prompt}</p>
          {currentRequestStep.task.action.params.requiredInfo && (
            <ul className="mt-2">
              {currentRequestStep.task.action.params.requiredInfo.map(
                (info, index) => (
                  <li key={index} className="text-sm text-muted-foreground">
                    {info}
                  </li>
                )
              )}
            </ul>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
