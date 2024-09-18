import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";

async function searchAction(formData: FormData) {
  "use server";
  const query = formData.get("query")?.toString();
  if (query?.trim()) {
    redirect(`/search?q=${encodeURIComponent(query)}`);
  }
}

export function SearchBar() {
  return (
    <div className="fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl px-4">
      <form action={searchAction} className="relative">
        <Input
          name="query"
          type="text"
          placeholder="Ask anything..."
          className="w-full py-4 pl-5 pr-14 text-xl rounded-full shadow-lg text-white border-2 border-gray-700 focus:border-gray-500"
        />
        <Button
          type="submit"
          size="icon"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-transparent hover:bg-transparent"
        >
          <Search className="h-6 w-6 text-white" />
          <span className="sr-only">Search</span>
        </Button>
      </form>
    </div>
  );
}
