'use client';

import { motion } from 'framer-motion';
import { Bookmark, Share2 } from 'lucide-react';
import clsx from 'clsx';
import { easings } from '@/lib/motion/easings';
import { durations } from '@/lib/motion/springs';

interface ArticleCardProps {
  article: {
    id: string;
    title: string;
    extract: string;
    imageUrl?: string;
    readTime: number;
    category: string;
  };
  index: number;
}

export function ArticleCard({ article, index }: ArticleCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: durations.normal,
        ease: easings.standard,
        delay: index * 0.08,
      }}
      className={clsx(
        'group relative flex flex-col gap-4 p-6',
        'bg-(--bg-card) rounded-xl overflow-hidden',
        'border border-(--border)',
        'hover:border-[rgba(255,255,255,0.12)] transition-colors duration-300'
      )}
    >
      <div className="flex flex-col gap-2 relative z-10">
        <div className="flex items-center justify-between">
          <span className="text-[11px] uppercase tracking-widest text-(--text-muted) font-mono font-medium">
            {article.category}
          </span>
          <span className="text-xs text-(--text-muted) font-mono">
            {article.readTime} min read
          </span>
        </div>
        
        <h2 className="text-2xl md:text-3xl font-serif text-(--text-primary) leading-snug tracking-tight mt-2 group-hover:text-(--accent) transition-colors duration-300">
          {article.title}
        </h2>
        
        <p className="text-sm md:text-base text-(--text-secondary) leading-loose mt-2 line-clamp-3">
          {article.extract}
        </p>
      </div>

      <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-(--border) relative z-10">
        <button 
          className="p-2 rounded-full text-(--text-muted) hover:text-(--text-primary) hover:bg-[rgba(255,255,255,0.04)] transition-all"
          aria-label="Share article"
        >
          <Share2 size={16} />
        </button>
        <button 
          className="p-2 rounded-full text-(--text-muted) hover:text-(--accent) hover:bg-[rgba(255,255,255,0.04)] transition-all"
          aria-label="Bookmark article"
        >
          <Bookmark size={16} />
        </button>
      </div>

      {/* Subtle hover gradient background effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-[rgba(255,255,255,0.02)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    </motion.article>
  );
}
