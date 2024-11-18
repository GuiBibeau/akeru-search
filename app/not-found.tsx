import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HomeIcon } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6 text-center">
          <div className="mb-6">
            <h1 className="text-4xl font-bold mb-2">404</h1>
            <p className="text-muted-foreground">
              Oops! The page you&apos;re looking for doesn&apos;t exist.
            </p>
          </div>
          <Link href="/">
            <Button
              variant="default"
              className="gap-2 bg-black text-white hover:bg-black/70"
            >
              <HomeIcon className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
