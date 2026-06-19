'use client';

import { useEffect } from 'react';

export default function ProfileError({
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
        <h2 className="text-xl font-serif text-(--text-primary) mb-2">Profile unavailable</h2>
        <p className="mb-6">We couldn&apos;t load your profile data right now. Please try again.</p>
        <button
          onClick={() => reset()}
          className="px-6 py-2 rounded-lg bg-[rgba(255,255,255,0.06)] hover:bg-[rgba(255,255,255,0.1)] transition-colors text-(--text-primary) border border-(--border)"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
