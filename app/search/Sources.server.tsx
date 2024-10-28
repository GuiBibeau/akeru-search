import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { FileIcon } from "lucide-react";
import Image from "next/image";

interface SearchResult {
  url: string;
  title: string;
  source: string;
  date: string;
  summary: string;
  icon?: string;
}

interface SourcesProps {
  sources: SearchResult[];
}

export function Sources({ sources }: SourcesProps) {
  return (
    <div className="w-full">
      <h2 className="text-xl font-bold mb-2 text-gray-300">Sources</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {sources.map((result, index) => (
          <a
            key={index}
            href={result.url}
            target="_blank"
            rel="noopener noreferrer"
            className="no-underline"
          >
            <Card className="bg-black-800 border-gray-700 hover:bg-black-700 transition-colors duration-200 h-24 flex flex-col relative">
              <CardContent className="p-3 flex flex-col flex-grow">
                {result.icon ? (
                  <Image
                    src={result.icon}
                    alt="Icon"
                    width={16}
                    height={16}
                    className="absolute top-2 right-2 w-4 h-4"
                  />
                ) : (
                  <FileIcon className="absolute top-2 right-2 w-4 h-4 text-gray-400" />
                )}
                <CardTitle className="text-xs text-gray-200 mb-1 line-clamp-1">
                  {result.title}
                </CardTitle>
                <div className="text-xs text-gray-400 mb-1 truncate">
                  <span>{result.source}</span> • <span>{result.date}</span>
                </div>
                <p className="text-xs text-gray-300 line-clamp-2">
                  {result.summary.replace(/<[^>]*>/g, "")}
                </p>
              </CardContent>
            </Card>
          </a>
        ))}
      </div>
    </div>
  );
}
