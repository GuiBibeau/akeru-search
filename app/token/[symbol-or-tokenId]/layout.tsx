import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function PrototypeLayout({
  children,
}: {
  children: React.ReactNode;
  params: Promise<{ "symbol-or-tokenId"?: string }>;
}) {
  return (
    <main className="flex-grow flex justify-center p-4">
      <div className="w-full max-w-4xl space-y-6">
        <div className="mb-4">
          <Link href="/">
            <Button variant="ghost" className="p-0 hover:bg-transparent">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to search
            </Button>
          </Link>
        </div>
        {children}
      </div>
    </main>
  );
}
