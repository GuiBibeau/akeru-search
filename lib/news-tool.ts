interface NewsResult {
  type: "news_result";
  url: string;
  title: string;
  description: string;
  age: string;
  page_age: string;
  page_fetched: string;
  breaking: boolean;
  thumbnail?: {
    src: string;
    original: string;
  };
  meta_url: {
    scheme: string;
    netloc: string;
    hostname: string;
    favicon: string;
    path: string;
  };
  extra_snippets?: string[];
}

interface BraveNewsResponse {
  type: "news";
  query: {
    original: string;
    altered?: string;
    cleaned?: string;
  };
  results: NewsResult[];
}

export class NewsTool {
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.BRAVE_API_KEY!;
  }

  async getNews(
    query: string,
    params: Record<string, string> = {}
  ): Promise<NewsResult[] | null> {
    try {
      const url = new URL("https://api.search.brave.com/res/v1/news/search");
      url.search = new URLSearchParams({
        q: query,
        count: "5",
        search_lang: "en",
        ...params,
      }).toString();

      const response = await fetch(url, {
        headers: {
          Accept: "application/json",
          "Accept-Encoding": "gzip",
          "X-Subscription-Token": this.apiKey,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = (await response.json()) as BraveNewsResponse;
      return data.results || null;
    } catch (error) {
      console.error("Error in getNews method:", error);
      return null;
    }
  }
}
