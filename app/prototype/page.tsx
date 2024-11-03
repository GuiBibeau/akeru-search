import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Prototype Page",
  description: "A basic Next.js prototype page",
};

export default function PrototypePage() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-4">Welcome to the Prototype Page</h1>
      <p className="text-gray-600">
        This is a basic Next.js page component. You can start building your
        content here.
      </p>
    </main>
  );
}
