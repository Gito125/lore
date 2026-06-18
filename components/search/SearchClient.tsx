'use client';

import { useState, useEffect } from 'react';
import { Search as SearchIcon } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface SearchResult {
  id: number;
  key: string;
  title: string;
  excerpt: string;
  description?: string;
  thumbnail?: {
    mimetype: string;
    size: number | null;
    width: number;
    height: number;
    duration: number | null;
    url: string;
  };
}

export function SearchClient() {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    async function performSearch() {
      if (!debouncedQuery.trim()) {
        setResults([]);
        return;
      }
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}`);
        const data = await res.json();
        if (data.pages) {
          setResults(data.pages);
        } else {
          setResults([]);
        }
      } catch (err) {
        console.error(err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }
    performSearch();
  }, [debouncedQuery]);

  return (
    <>
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <SearchIcon className="h-5 w-5 text-(--text-muted) group-focus-within:text-(--accent) transition-colors" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="block w-full pl-12 pr-4 py-4 bg-[rgba(255,255,255,0.02)] border border-(--border) rounded-xl text-(--text-primary) placeholder-(--text-muted) focus:outline-none focus:ring-1 focus:ring-(--accent) focus:border-(--accent) focus:bg-[rgba(255,255,255,0.04)] transition-all duration-300 backdrop-blur-md"
          placeholder="Search topics, articles, or concepts..."
        />
        {loading && (
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
            <div className="w-4 h-4 border-2 border-(--text-muted) border-t-(--accent) rounded-full animate-spin" />
          </div>
        )}
      </div>

      {!debouncedQuery.trim() && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          {['History', 'Science', 'Philosophy', 'Art', 'Technology', 'Mythology'].map((topic) => (
            <Link key={topic} href={`/article/${topic}`} className="p-4 rounded-lg border border-(--border) bg-[rgba(255,255,255,0.01)] hover:bg-[rgba(255,255,255,0.03)] hover:border-[rgba(255,255,255,0.1)] transition-colors cursor-pointer text-center block">
              <span className="font-sans text-sm text-(--text-secondary)">{topic}</span>
            </Link>
          ))}
        </div>
      )}

      {results.length > 0 && (
        <div className="flex flex-col gap-4 mt-4">
          {results.map((result) => (
            <Link key={result.key} href={`/article/${encodeURIComponent(result.key)}`}>
              <div className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl border border-(--border) bg-[rgba(26,26,46,0.3)] hover:bg-[rgba(26,26,46,0.6)] transition-all duration-300 group">
                {result.thumbnail && result.thumbnail.url ? (
                  <div className="relative w-full sm:w-24 h-48 sm:h-24 rounded-lg overflow-hidden shrink-0 bg-(--bg-secondary)">
                    <Image 
                      src={result.thumbnail.url.startsWith('//') ? `https:${result.thumbnail.url}` : result.thumbnail.url}
                      alt={result.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 100px"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ) : (
                  <div className="hidden sm:flex w-24 h-24 rounded-lg bg-[rgba(255,255,255,0.02)] border border-(--border) items-center justify-center shrink-0">
                    <SearchIcon className="w-6 h-6 text-(--text-muted) opacity-50" />
                  </div>
                )}
                <div className="flex flex-col gap-1 overflow-hidden">
                  <h3 className="text-lg font-serif text-(--text-primary) group-hover:text-(--accent) transition-colors truncate">
                    {result.title}
                  </h3>
                  {result.description && (
                    <span className="text-xs font-mono text-(--text-muted) uppercase tracking-wider truncate block">
                      {result.description}
                    </span>
                  )}
                  <div 
                    className="text-sm text-(--text-secondary) leading-relaxed line-clamp-2 mt-1"
                    dangerouslySetInnerHTML={{ __html: result.excerpt }} 
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
      
      {debouncedQuery.trim() && !loading && results.length === 0 && (
        <div className="text-center py-12 text-(--text-muted) font-mono text-sm">
          No results found for &quot;{debouncedQuery}&quot;
        </div>
      )}
    </>
  );
}
