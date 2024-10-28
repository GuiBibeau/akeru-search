// Define types for the input data structure
export type SearchResult = {
  title: string;
  url: string;
  description: string;
  profile: {
    name: string;
    long_name: string;
    img: string;
  };
  age: string;
  extra_snippets: string[];
  page_age?: string;
  thumbnail?: {
    src: string;
  };
  article?: {
    date?: string;
  };
};

// Define a type for the output data structure
export type ProcessedResult = {
  title: string;
  source: string;
  url: string;
  date: string;
  summary: string;
  keyPoints: string[];
  image: string;
  thumbnailSrc?: string;
};

// Define a type for configuration options
export type ProcessingOptions = {
  maxResults?: number;
  minSnippets?: number;
};

// Function to check if a date is valid
const isValidDate = (date: Date): boolean => !isNaN(date.getTime());

// Function to parse a date string
const parseDate = (dateString: string): Date | null => {
  const date = new Date(dateString);
  if (isValidDate(date)) return date;

  const formats = [
    {
      regex: /(\d{4})-(\d{2})-(\d{2})/, // YYYY-MM-DD
      parser: (match: RegExpMatchArray) =>
        new Date(+match[1], +match[2] - 1, +match[3]),
    },
    {
      regex: /(\d{2})\/(\d{2})\/(\d{4})/, // MM/DD/YYYY
      parser: (match: RegExpMatchArray) =>
        new Date(+match[3], +match[1] - 1, +match[2]),
    },
    {
      regex: /(\w+)\s(\d{1,2}),\s(\d{4})/, // Month DD, YYYY
      parser: (match: RegExpMatchArray) =>
        new Date(`${match[1]} ${match[2]}, ${match[3]}`),
    },
  ];

  const parsedDate = formats
    .map(({ regex, parser }) => {
      const match = dateString.match(regex);
      if (match) {
        const date = parser(match);
        return isValidDate(date) ? date : null;
      }
      return null;
    })
    .find((date): date is Date => date !== null);

  return parsedDate || null;
};

// Function to extract the most reliable date from a SearchResult
const extractReliableDate = (result: SearchResult): Date => {
  const dateCandidates = [
    result.page_age,
    result.age,
    result.article?.date,
  ].filter(Boolean) as string[];

  const parsedDate = dateCandidates
    .map((dateString) => parseDate(dateString))
    .find((date): date is Date => date !== null);

  return parsedDate || new Date();
};

// Main function to process the search results
export const processSearchResults = (
  searchResults: SearchResult[],
  options: ProcessingOptions = {}
): ProcessedResult[] => {
  const { maxResults = 10, minSnippets = 2 } = options;

  const uniqueResults = [
    ...new Map(searchResults.map((item) => [item.url, item])).values(),
  ];

  const mappedResults = uniqueResults
    .map((result) => {
      const reliableDate = extractReliableDate(result);
      return {
        title: result.title,
        source: result.profile.name,
        url: result.url,
        date: reliableDate.toISOString().split("T")[0], // YYYY-MM-DD format
        summary: result.description,
        keyPoints: result.extra_snippets?.slice(0, minSnippets) || [],
        icon: result.profile.img,
        thumbnailSrc: result.thumbnail?.src,
        sortDate: reliableDate,
      };
    })
    .sort((a, b) => b.sortDate.getTime() - a.sortDate.getTime());

  return mappedResults.slice(0, maxResults).map(({ sortDate, ...rest }) => ({
    ...rest,
    image: rest.thumbnailSrc || "",
  }));
};
