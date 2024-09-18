import Link from "next/link";
import Image from "next/image";

export function NavBar() {
  return (
    <nav className="sticky top-0 z-50 bg-black text-white p-4 border-b border-white/50">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="/logo.jpeg"
            alt="Akeru Search Logo"
            width={40}
            height={40}
            className="rounded-full"
          />
          <span className="text-xl font-bold">Akeru Search</span>
        </Link>
        <div className="space-x-4">
          <a
            href="https://github.com/GuiBibeau/akeru-search"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block py-2 px-4 bg-transparent text-white font-semibold rounded-lg border border-white/50 hover:bg-white hover:text-black transition duration-300 ease-in-out"
          >
            ⭐ Star on GitHub
          </a>
        </div>
      </div>
    </nav>
  );
}
