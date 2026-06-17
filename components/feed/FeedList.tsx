'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { ArticleCard } from './ArticleCard';
import { FeedSkeleton } from './FeedSkeleton';
import type { WikipediaArticle } from '@/lib/wikipedia/api';

interface FeedArticle {
  id: string;
  title: string;
  extract: string;
  imageUrl?: string;
  readTime: number;
  category: string;
}

function mapToFeedArticle(article: WikipediaArticle): FeedArticle {
  return {
    id: article.id,
    title: article.title,
    extract: article.extract,
    imageUrl: article.thumbnail?.source,
    readTime: article.wordCount ? Math.max(1, Math.ceil(article.wordCount / 250)) : 5,
    category: article.categories?.[0] || 'Uncategorized',
  };
}

export function FeedList({ initialArticles }: { initialArticles: FeedArticle[] }) {
  const [articles, setArticles] = useState<FeedArticle[]>(initialArticles);
  const [page, setPage] = useState(2);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  
  const loaderRef = useRef<HTMLDivElement>(null);

  const loadMore = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/recommendations?page=${page}`);
      if (!res.ok) throw new Error('Failed to fetch more articles');
      const data = await res.json();
      
      if (data.recommendations && data.recommendations.length > 0) {
        const mapped = data.recommendations.map(mapToFeedArticle);
        setArticles(prev => [...prev, ...mapped]);
        setPage(data.nextPage || page + 1);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error(err);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !loading && hasMore) {
        loadMore();
      }
    }, { threshold: 1.0 });

    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [loading, hasMore, loadMore]);

  return (
    <div className="flex flex-col gap-6 w-full max-w-2xl mx-auto">
      {articles.map((article, i) => (
        <ArticleCard key={`${article.id}-${i}`} article={article} index={i} />
      ))}
      
      {hasMore && (
        <div ref={loaderRef} className="py-8">
          {loading && <FeedSkeleton />}
        </div>
      )}
      
      {!hasMore && articles.length > 0 && (
        <div className="text-center py-12 text-(--text-muted) font-mono text-sm">
          You&apos;ve reached the end of your personalized feed.
        </div>
      )}
    </div>
  );
}
