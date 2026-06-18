'use client';

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

interface LikeButtonProps {
  articleId: string;
  title: string;
}

export function LikeButton({ articleId, title }: LikeButtonProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkLike() {
      try {
        const res = await fetch(`/api/likes/${articleId}`);
        if (res.ok) {
          const data = await res.json();
          setIsLiked(data.isLiked);
        }
      } catch (error) {
        console.error('Failed to check like status', error);
      } finally {
        setIsLoading(false);
      }
    }
    checkLike();
  }, [articleId]);

  const toggleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (isLoading) return;

    const previousState = isLiked;
    setIsLiked(!isLiked);

    try {
      if (previousState) {
        const res = await fetch(`/api/likes/${articleId}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Failed to remove like');
      } else {
        const res = await fetch('/api/likes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ articleId, title })
        });
        if (!res.ok) throw new Error('Failed to add like');
      }
    } catch (error) {
      console.error(error);
      setIsLiked(previousState);
    }
  };

  return (
    <button
      onClick={toggleLike}
      disabled={isLoading}
      className={clsx(
        'p-2 rounded-full transition-all relative overflow-hidden group',
        isLiked
          ? 'text-red-500 bg-[rgba(255,255,255,0.08)]'
          : 'text-(--text-muted) hover:text-red-400 hover:bg-[rgba(255,255,255,0.04)]',
        isLoading && 'opacity-50 cursor-not-allowed'
      )}
      aria-label={isLiked ? 'Remove like' : 'Like article'}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={isLiked ? 'liked' : 'unliked'}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <Heart size={16} className={clsx(isLiked && 'fill-current')} />
        </motion.div>
      </AnimatePresence>
    </button>
  );
}
