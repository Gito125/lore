'use client';

import { useState, useEffect } from 'react';
import { Bookmark } from 'lucide-react';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

interface BookmarkButtonProps {
  articleId: string;
  title: string;
  summary?: string;
}

export function BookmarkButton({ articleId, title, summary }: BookmarkButtonProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkBookmark() {
      try {
        const res = await fetch(`/api/bookmarks/${articleId}`);
        if (res.ok) {
          const data = await res.json();
          setIsBookmarked(data.isBookmarked);
        }
      } catch (error) {
        console.error('Failed to check bookmark status', error);
      } finally {
        setIsLoading(false);
      }
    }
    checkBookmark();
  }, [articleId]);

  const toggleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating if wrapped in a link
    if (isLoading) return;

    const previousState = isBookmarked;
    setIsBookmarked(!isBookmarked);

    try {
      if (previousState) {
        // Remove bookmark
        const res = await fetch(`/api/bookmarks/${articleId}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Failed to remove bookmark');
      } else {
        // Add bookmark
        const res = await fetch('/api/bookmarks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ articleId, title, summary })
        });
        if (!res.ok) throw new Error('Failed to add bookmark');
      }
    } catch (error) {
      console.error(error);
      setIsBookmarked(previousState); // Revert on failure
    }
  };

  return (
    <button
      onClick={toggleBookmark}
      disabled={isLoading}
      className={clsx(
        'p-2 rounded-full transition-all relative overflow-hidden group',
        isBookmarked
          ? 'text-(--accent) bg-[rgba(255,255,255,0.08)]'
          : 'text-(--text-muted) hover:text-(--text-primary) hover:bg-[rgba(255,255,255,0.04)]',
        isLoading && 'opacity-50 cursor-not-allowed'
      )}
      aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark article'}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={isBookmarked ? 'bookmarked' : 'unbookmarked'}
          initial={{ scale: 0.5, opacity: 0, rotate: isBookmarked ? -15 : 15 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          exit={{ scale: 0.5, opacity: 0, transition: { duration: 0.1 } }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        >
          <Bookmark size={16} className={clsx(isBookmarked && 'fill-current')} />
        </motion.div>
      </AnimatePresence>
    </button>
  );
}
