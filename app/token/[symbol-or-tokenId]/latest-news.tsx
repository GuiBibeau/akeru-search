import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronRight, Radio } from "lucide-react";
import { getTimeAgo } from "@/lib/utils/time";

interface Article {
  title: string;
  content: string;
  url: string;
}

interface LatestNewsProps {
  title: string;
  articles: Article[];
  lastUpdated: number;
}

export function LatestNews({ title, articles, lastUpdated }: LatestNewsProps) {
  return (
    <Card className="w-full max-w-3xl">
      <CardHeader className="flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Radio className="h-4 w-4 text-primary" aria-hidden="true" />
          <CardTitle>{title}</CardTitle>
        </div>
        <span className="text-sm text-muted-foreground">
          {getTimeAgo(lastUpdated)}
        </span>
      </CardHeader>
      <CardContent className="grid gap-6">
        {articles.map((article, index) => (
          <a
            key={index}
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group grid gap-2 hover:bg-muted/50 rounded-lg p-2 transition-colors"
          >
            <div className="flex items-start justify-between gap-4">
              <h3 className="font-semibold leading-tight">{article.title}</h3>
              <ChevronRight
                className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              />
            </div>
            <p className="text-sm text-muted-foreground">{article.content}</p>
          </a>
        ))}
      </CardContent>
    </Card>
  );
}
