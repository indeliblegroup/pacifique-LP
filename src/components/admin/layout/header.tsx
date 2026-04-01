'use client';

import { useSession } from 'next-auth/react';
import { User } from 'lucide-react';
import { GlobalSearch } from './global-search';

export function Header() {
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-6 shadow-sm">
      <div className="flex flex-1 gap-x-4 justify-between items-center">
        {/* Global Search */}
        <div className="flex-1 max-w-lg">
          <GlobalSearch />
        </div>

        {/* User info */}
        <div className="flex items-center gap-x-3">
          <div className="flex items-center gap-x-2 text-sm">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-4 w-4 text-primary" />
            </div>
            <div className="hidden md:block">
              <p className="font-medium text-gray-900">{session?.user?.name}</p>
              <p className="text-xs text-gray-500">{session?.user?.role}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
