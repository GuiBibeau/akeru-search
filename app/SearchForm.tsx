"use client";

import { getSuggestions } from "@/actions/getAutocompleteSuggestions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState, useEffect, useRef, KeyboardEvent } from "react";

export const SearchForm: React.FC<{
  searchAction: (formData: FormData) => void;
}> = ({ searchAction }) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prevIndex) =>
        prevIndex < suggestions.length - 1 ? prevIndex + 1 : prevIndex
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : -1));
    } else if (e.key === "Enter") {
      if (selectedIndex !== -1) {
        e.preventDefault();
        setQuery(suggestions[selectedIndex]);
        setSuggestions([]);
        setSelectedIndex(-1);
        performSearch(suggestions[selectedIndex]);
      } else {
        // Allow form submission when Enter is pressed and no suggestion is selected
        formRef.current?.requestSubmit();
      }
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setSuggestions([]);
    setSelectedIndex(-1);
    inputRef.current?.focus();
    performSearch(suggestion);
  };

  const performSearch = (query: string) => {
    const formData = new FormData();
    formData.append("query", query);
    searchAction(formData);
  };

  return (
    <form ref={formRef} action={searchAction} className="relative mb-4">
      <Input
        ref={inputRef}
        name="query"
        type="text"
        value={query}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="Ask anything..."
        autoComplete="off"
        className="w-full py-2 pl-5 pr-14 text-xl rounded-lg shadow-lg bg-black text-white border border-white/50 focus:border-white placeholder-gray-400"
      />
      <Button
        type="submit"
        size="icon"
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-transparent text-white font-semibold rounded-lg hover:bg-white/10 hover:text-white transition-all duration-300 ease-in-out"
      >
        <Search className="h-5 w-5 border-none" />
        <span className="sr-only">Search</span>
      </Button>
      {suggestions.length > 0 && (
        <ul className="absolute z-10 w-full bg-black border border-white/50 rounded-lg mt-1 shadow-lg">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              className={`px-4 py-2 cursor-pointer hover:bg-white/10 ${
                index === selectedIndex ? "bg-white/20" : ""
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
