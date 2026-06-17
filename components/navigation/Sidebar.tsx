'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, Bookmark, Bell, User, Settings, Library } from 'lucide-react';
import clsx from 'clsx';

const navItems = [
  { name: 'Feed', href: '/feed', icon: Home },
  { name: 'Search', href: '/search', icon: Search },
  { name: 'Bookmarks', href: '/bookmarks', icon: Bookmark },
  { name: 'Notifications', href: '/notifications', icon: Bell },
  { name: 'Profile', href: '/profile', icon: User },
];

export function Sidebar() {
  const pathname = usePathname() || '';

  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-(--border) bg-(--bg-primary) h-screen sticky top-0 px-4 py-8">
      <div className="flex items-center gap-3 px-4 mb-12">
        <Library className="w-8 h-8 text-(--accent)" />
        <span className="font-serif text-2xl font-bold tracking-tight text-(--text-primary)">Lore</span>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={clsx(
                'flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-300 group',
                isActive 
                  ? 'bg-(--accent)/10 text-(--accent) font-medium' 
                  : 'text-(--text-secondary) hover:text-(--text-primary) hover:bg-[rgba(255,255,255,0.03)]'
              )}
            >
              <Icon className={clsx('w-5 h-5 transition-transform duration-300 group-hover:scale-110', isActive ? 'text-(--accent)' : '')} />
              <span className="font-sans text-sm">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-8 border-t border-[rgba(255,255,255,0.05)]">
        <Link
          href="/settings"
          className={clsx(
            'flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-300 group',
            pathname.startsWith('/settings')
              ? 'bg-(--accent)/10 text-(--accent) font-medium' 
              : 'text-(--text-secondary) hover:text-(--text-primary) hover:bg-[rgba(255,255,255,0.03)]'
          )}
        >
          <Settings className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
          <span className="font-sans text-sm">Settings</span>
        </Link>
      </div>
    </aside>
  );
}
