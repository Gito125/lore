'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function ArticleError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center gap-6">
      <div className="text-(--text-muted) max-w-md">
        <h2 className="text-xl font-serif text-(--text-primary) mb-2">Failed to load article</h2>
        <p className="mb-6">We couldn't retrieve this article. It may have been deleted or there's a network issue.</p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => reset()}
            className="px-6 py-2 rounded-lg bg-[rgba(255,255,255,0.06)] hover:bg-[rgba(255,255,255,0.1)] transition-colors text-(--text-primary) border border-(--border)"
          >
            Try Again
          </button>
          <Link
            href="/feed"
            className="px-6 py-2 rounded-lg bg-(--accent) text-white hover:bg-(--accent-hover) transition-colors"
          >
            Go to Feed
          </Link>
        </div>
      </div>
    </div>
  );
}
