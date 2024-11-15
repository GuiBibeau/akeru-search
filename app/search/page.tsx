import { NavBar } from "@/components/NavBar";
import { TaskPlanner } from "../../lib/TaskPlanner";
import ReasoningLayout from "./reasoning-layout";

export default async function Home(props: {
  searchParams: Promise<{ q?: string }>;
}) {
  const searchParams = await props.searchParams;
  const initialQuery = searchParams.q || "";

  const taskPlanner = new TaskPlanner();
  const taskPlan = taskPlanner.searchPlan(initialQuery);

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-grow flex justify-center p-4">
        <div className="w-full max-w-4xl space-y-6">
          <h1 className="text-3xl font-bold">{initialQuery}</h1>
          <ReasoningLayout initialTaskPlan={taskPlan} />
        </div>
      </main>
    </div>
  );
}
