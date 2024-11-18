export default async function PrototypeLayout({
  children,
}: {
  children: React.ReactNode;
  params: Promise<{ "symbol-or-tokenId"?: string }>;
}) {
  return (
    <main className="flex-grow flex justify-center p-4">
      <div className="w-full max-w-4xl space-y-6">{children}</div>
    </main>
  );
}
