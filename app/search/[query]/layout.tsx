import { createStringFromParam } from "@/lib/create-param-from-string";

export default async function PrototypeLayout({
  children,

  ...props
}: {
  children: React.ReactNode;
  sources: React.ReactNode;
  summary: React.ReactNode;
  params: Promise<{ query?: string }>;
}) {
  const params = await props.params;
  const query = params.query;
  const searchPrompt = createStringFromParam(query!);

  return (
    <main className="flex-grow flex justify-center p-4">
      <div className="w-full max-w-4xl space-y-6">
        <h1 className="text-3xl font-bold">{searchPrompt}</h1>
        {children}
      </div>
    </main>
  );
}
