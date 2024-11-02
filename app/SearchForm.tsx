"use client";

import { getSuggestions } from "@/actions/getAutocompleteSuggestions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Search } from "lucide-react";
import { useState, useEffect, useRef, KeyboardEvent } from "react";
import { cn } from "@/lib/utils";

export const SearchForm: React.FC<{
  searchAction: (formData: FormData) => void;
}> = ({ searchAction }) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const fetchSuggestions = async (input: string) => {
    try {
      const data = await getSuggestions(input);
      setSuggestions(data);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setSuggestions([]);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query.trim().length > 0) {
        fetchSuggestions(query.trim());
      } else {
        setSuggestions([]);
      }
    }, 100);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    setSelectedIndex(-1);

    // Adjust textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prevIndex) =>
        prevIndex < suggestions.length - 1 ? prevIndex + 1 : prevIndex
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : -1));
    } else if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (selectedIndex !== -1) {
        setQuery(suggestions[selectedIndex]);
        setSuggestions([]);
        setSelectedIndex(-1);
        performSearch(suggestions[selectedIndex]);
      } else {
        formRef.current?.requestSubmit();
      }
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setSuggestions([]);
    setSelectedIndex(-1);
    textareaRef.current?.focus();
    performSearch(suggestion);
  };

  const performSearch = (query: string) => {
    const formData = new FormData();
    formData.append("query", query);
    searchAction(formData);
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
      {suggestions.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg mt-1 shadow-lg">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                index === selectedIndex ? "bg-gray-200" : ""
              }`}
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </form>
  );
};
