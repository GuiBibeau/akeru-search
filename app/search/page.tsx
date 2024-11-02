import { TaskPlanner } from "../lib/TaskPlanner";
import ReasoningLayout from "./reasoning-layout";
import { llama3point1Versatile } from "@/chat-models/llama-3-point-1-70b-versatile";

export default async function Home(props: {
  searchParams: Promise<{ q?: string }>;
}) {
  const searchParams = await props.searchParams;
  const initialQuery = searchParams.q || "";

  const taskPlanner = new TaskPlanner(llama3point1Versatile);
  const taskPlan = await taskPlanner.planTask(initialQuery);

  return (
    <ReasoningLayout initialQuery={initialQuery} initialTaskPlan={taskPlan} />
  );
}
