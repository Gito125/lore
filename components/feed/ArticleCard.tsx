'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { BookmarkButton } from './BookmarkButton';
import { ShareButton } from './ShareButton';
import clsx from 'clsx';
import { easings } from '@/lib/motion/easings';
import { durations } from '@/lib/motion/springs';
import Link from 'next/link';
import Image from 'next/image';

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
  const [imgError, setImgError] = useState(false);

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
        'group relative flex flex-col p-8',
        'bg-[rgba(26,26,46,0.5)] backdrop-blur-xl rounded-2xl overflow-hidden',
        'border border-[rgba(255,255,255,0.06)]',
        'hover:border-[rgba(255,255,255,0.15)] hover:shadow-[0_0_40px_rgba(108,99,255,0.12)]',
        'transition-all duration-500 ease-out'
      )}
    >
      {article.imageUrl && !imgError && (
        <div className="relative w-full h-48 mb-6 rounded-xl overflow-hidden border border-[rgba(255,255,255,0.04)] bg-(--bg-secondary)">
          <Image 
            src={article.imageUrl} 
            alt={article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            onError={() => setImgError(true)}
          />
        </div>
      )}

      <div className="flex flex-col gap-3 relative z-10">
        <div className="flex items-center justify-between">
          <span className="text-[11px] uppercase tracking-[0.2em] text-(--text-muted) font-mono font-medium group-hover:text-(--accent)/80 transition-colors duration-300">
            {article.category}
          </span>
          <span className="text-xs text-(--text-muted) font-mono tracking-wide">
            {article.readTime} min read
          </span>
        </div>
        
        <Link href={`/article/${article.id}`}>
          <h2 className="text-3xl md:text-4xl font-serif text-(--text-primary) leading-[1.15] tracking-tight mt-2 group-hover:text-(--accent) transition-colors duration-500">
            {article.title}
          </h2>
        </Link>
        
        <p className="text-sm md:text-[15px] text-(--text-secondary) leading-[1.8] mt-3 line-clamp-3">
          {article.extract}
        </p>
      </div>

      <div className="flex items-center justify-end gap-4 mt-6 pt-6 border-t border-[rgba(255,255,255,0.06)] relative z-10">
        <ShareButton 
          articleId={article.id}
          title={article.title}
          summary={article.extract}
        />
        <BookmarkButton 
          articleId={article.id}
          title={article.title}
          summary={article.extract}
        />
      </div>

      {/* Deep subtle gradient glow */}
      <div className="absolute -inset-[100%] bg-gradient-to-br from-[rgba(108,99,255,0.08)] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none group-hover:rotate-12" />
    </motion.article>
  );
}
