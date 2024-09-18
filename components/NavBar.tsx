import Link from "next/link";

export function NavBar() {
  return (
    <nav className="sticky top-0 z-50 bg-black text-white p-4 border-b border-white">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          Akeru Search
        </Link>
        <div className="space-x-4">
          <Link href="/" className="hover:text-gray-300">
            Home
          </Link>
          <Link href="/about" className="hover:text-gray-300">
            About
          </Link>
        </div>
      </div>
    </nav>
  );
}
