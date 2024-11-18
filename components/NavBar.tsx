import Link from "next/link";

export function NavBar() {
  return (
    <>
      <div className="fixed top-0 left-0 right-0 h-[4.5rem] bg-white/80 backdrop-blur-sm z-40" />
      <nav className="sticky top-0 z-50 p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold">Open Search</span>
          </Link>
          <div className="space-x-4">
            <a
              href="https://github.com/GuiBibeau/akeru-search"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block py-2 px-4 font-semibold rounded-lg border hover:bg-gray-100 transition duration-300 ease-in-out"
            >
              ⭐ Star on GitHub
            </a>
          </div>
        </div>
      </nav>
    </>
  );
}
