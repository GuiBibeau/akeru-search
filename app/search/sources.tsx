import { Card, CardContent } from "@/components/ui/card";
import { FileIcon, ExternalLinkIcon } from "lucide-react";
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
    <div className="w-full space-y-4">
      <h2 className="text-2xl font-bold text-primary">Sources</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {sources.map((result, index) => (
          <Card
            key={index}
            className="group overflow-hidden transition-all duration-300 hover:shadow-lg dark:hover:shadow-primary/25 hover:-translate-y-1"
          >
            <a
              href={result.url}
              target="_blank"
              rel="noopener noreferrer"
              className="no-underline"
            >
              <CardContent className="p-4 h-full flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <h3 className="text-sm font-semibold text-primary line-clamp-1 flex-grow pr-2">
                      {result.title}
                    </h3>
                    {result.icon ? (
                      <Image
                        src={result.icon}
                        alt="Source icon"
                        width={20}
                        height={20}
                        className="rounded-sm"
                      />
                    ) : (
                      <FileIcon className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {result.summary.replace(/<[^>]*>/g, "")}
                  </p>
                </div>
                <div className="flex items-center justify-between mt-4 text-xs text-muted-foreground">
                  <span className="truncate max-w-[calc(100%-4rem)]">
                    {result.source}
                  </span>
                  <span>{result.date}</span>
                </div>
              </CardContent>
            </a>
            <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <ExternalLinkIcon className="w-4 h-4 text-muted-foreground" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
