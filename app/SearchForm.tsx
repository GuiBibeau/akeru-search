"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Search } from "lucide-react";
import { useState, useRef, KeyboardEvent } from "react";
import { cn } from "@/lib/utils";

export const SearchForm: React.FC<{
  searchAction: (formData: FormData) => void;
}> = ({ searchAction }) => {
  const [query, setQuery] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);

    // Adjust textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      formRef.current?.requestSubmit();
    }
  };

  return (
    <form ref={formRef} action={searchAction} className="relative mb-4">
      <Textarea
        ref={textareaRef}
        name="query"
        value={query}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="Ask anything..."
        rows={2}
        className="w-full min-h-[64px] max-h-[300px] py-3 pl-5 pr-14 text-base rounded-lg shadow-lg border border-gray-200 focus:border-gray-400 placeholder-gray-500 overflow-hidden resize-none"
      />
      <Button
        type="submit"
        size="icon"
        variant="ghost"
        disabled={!query.trim()}
        className={cn(
          "absolute right-2 top-1/2 transform -translate-y-1/2 transition-all duration-300 ease-in-out",
          query.trim()
            ? "bg-black text-white hover:text-white hover:bg-black/70"
            : "bg-gray-100 text-gray-400"
        )}
      >
        <Search className="h-5 w-5" />
        <span className="sr-only">Search</span>
      </Button>
    </form>
  );
};
