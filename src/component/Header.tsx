import Image from "next/image";
import Link from "next/link";

export function Header() {
  return (
    <header className="flex items-center justify-between p-4 w-full h-16 bg-white shadow">
      <h1 className="text-2xl font-bold">Record To Webm</h1>
      <nav>
        <ul className="flex space-x-4">
          <li>
            <Link href="/" className="hover:text-gray-400">
              <Image src="/home.svg" width="24" height="24" alt="home" />
            </Link>
          </li>
          <li>
            <Link href="https://github.com/junotb/record-to-webm" target="_blank" className="hover:text-gray-400">
              <Image src="/github-mark.svg" width="24" height="24" alt="github" />
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}