'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, Bookmark, User, Bell } from 'lucide-react';
import clsx from 'clsx';

const navItems = [
  { name: 'Feed', href: '/feed', icon: Home },
  { name: 'Search', href: '/search', icon: Search },
  { name: 'Bookmarks', href: '/bookmarks', icon: Bookmark },
  { name: 'Notifications', href: '/notifications', icon: Bell },
  { name: 'Profile', href: '/profile', icon: User },
];

export function BottomNav() {
  const pathname = usePathname() || '';

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-(--bg-primary)/80 backdrop-blur-xl border-t border-(--border) pb-safe">
      <div className="flex items-center justify-around px-2 py-3">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={clsx(
                'flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-300',
                isActive ? 'text-(--accent)' : 'text-(--text-secondary) hover:text-(--text-primary)'
              )}
            >
              <div className="relative">
                 {isActive && <Icon className="w-6 h-6 fill-current opacity-20 absolute" />}
                 <Icon className="w-6 h-6 relative z-10" />
              </div>
              <span className="text-[10px] font-sans font-medium">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
