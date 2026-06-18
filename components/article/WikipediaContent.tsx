'use client';

import { useRouter } from 'next/navigation';
import { MouseEvent, useRef } from 'react';

interface WikipediaContentProps {
  htmlContent: string;
}

export function WikipediaContent({ htmlContent }: WikipediaContentProps) {
  const router = useRouter();
  const contentRef = useRef<HTMLDivElement>(null);

  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    // Find the closest anchor tag
    const anchor = target.closest('a');
    
    if (!anchor) return;

    const href = anchor.getAttribute('href');
    if (!href) return;

    // Handle /wiki/... links
    if (href.startsWith('/wiki/')) {
      e.preventDefault();
      const title = href.replace('/wiki/', '');
      
      // If it's a File: or Special: namespace, open in new tab instead
      if (title.startsWith('File:') || title.startsWith('Special:')) {
        window.open(`https://en.wikipedia.org/wiki/${title}`, '_blank', 'noopener,noreferrer');
        return;
      }

      router.push(`/article/${title}`);
      return;
    }

    // Handle /w/index.php?... links
    if (href.startsWith('/w/index.php')) {
      const url = new URL(href, window.location.origin);
      const title = url.searchParams.get('title');
      if (title) {
        e.preventDefault();
        router.push(`/article/${title}`);
        return;
      }
    }
  };

  return (
    <div 
      ref={contentRef}
      className="text-(--text-secondary) leading-relaxed wikipedia-content"
      dangerouslySetInnerHTML={{ __html: htmlContent }} 
      onClick={handleClick}
    />
  );
}
