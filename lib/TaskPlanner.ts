import { TaskPlan } from "../app/types";

export class TaskPlanner {
  planTask(query: string): TaskPlan {
    return {
      query,
      steps: [
        {
          id: 1,
          description: "Search for information",
          action: {
            type: "search",
            params: {
              query: query,
            },
          },
        },
        {
          id: 2,
          description: "Summarize findings",
          dependencies: [1],
          action: {
            type: "summarize",
            params: {
              query: `Summarize the search results about: ${query}`,
            },
          },
        },
      ],
    };
  }
}
