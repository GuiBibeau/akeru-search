import { SearchArtifact } from "../types/reasoning";
import { useReasoningContext } from "./reasoning-context";
import { Sources } from "./sources";

export const SourcesDisplay = () => {
  const { artifacts } = useReasoningContext();

  // Filter for search artifacts
  const searchArtifacts = artifacts.filter(
    (artifact): artifact is SearchArtifact => artifact.taskType === "search"
  );

  // If no search artifacts, don't render anything
  if (searchArtifacts.length === 0) {
    return null;
  }

  // Transform the search artifacts into the format expected by Sources component
  const sources = searchArtifacts
    .flatMap((artifact) =>
      artifact.artifact.map((result) => ({
        url: result.url,
        title: result.title,
        source: result.source,
        date: result.date,
        summary: result.summary,
        icon: result.icon,
      }))
    )
    .slice(0, 4); // Limit to 4 sources

  return <Sources sources={sources} />;
};
