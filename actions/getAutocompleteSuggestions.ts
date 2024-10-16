"use server";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

export async function getSuggestions(query: string) {
  if (!query) {
    return [];
  }

  try {
    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content:
              "You are a search autocomplete generator. Provide 5 relevant autocomplete suggestions that complete or extend the given query. Return the suggestions as a comma-separated list, without any additional text, formatting, or explanation. Each suggestion should start with the original query.",
          },
          {
            role: "user",
            content: `Generate 5 search autocomplete suggestions for: "${query}"`,
          },
        ],
        temperature: 0.5,
        max_tokens: 150,
        top_p: 1,
        stream: false,
        n: 1,
      }),
    });

    if (!response.ok) {
      throw new Error(`GROQ API responded with status ${response.status}`);
    }

    const data = await response.json();
    const suggestions = data.choices[0].message.content
      .split(/,|\n/) // Split by comma or newline
      .map((suggestion: string) => suggestion.trim())
      .filter(Boolean)
      .map((suggestion: string) => {
        // Ensure each suggestion starts with the original query
        return suggestion.startsWith(query)
          ? suggestion
          : `${query} ${suggestion}`;
      })
      .slice(0, 5);

    return suggestions;
  } catch (error) {
    console.error("Error generating suggestions:", error);
    return [];
  }
}
