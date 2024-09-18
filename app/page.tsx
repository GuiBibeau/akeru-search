import { NavBar } from "@/components/NavBar";
import { SearchBar } from "./SearchBar";

export interface SearchResult {
  url: string;
  title: string;
}

export default async function Home() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <NavBar />
      <div className="flex-grow flex flex-col items-center p-4">
        <SearchBar />
      </div>
    </div>
  );
}
