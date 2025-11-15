'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(path + '/');
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              AI Scout
            </Link>
          </div>

          <nav className="flex gap-6">
            <Link
              href="/chat"
              className={`px-4 py-2 rounded-lg transition-colors ${
                isActive('/chat')
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              AI Chat
            </Link>
            <Link
              href="/research"
              className={`px-4 py-2 rounded-lg transition-colors ${
                isActive('/research')
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Research
            </Link>
            <Link
              href="/results"
              className={`px-4 py-2 rounded-lg transition-colors ${
                isActive('/results')
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Results
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
