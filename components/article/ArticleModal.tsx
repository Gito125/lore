'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import { easings } from '@/lib/motion/easings';
import { durations } from '@/lib/motion/springs';
import { useEffect } from 'react';

export function ArticleModal({ children, articleId }: { children: React.ReactNode, articleId: string }) {
  const router = useRouter();

  // Prevent background scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/60 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={() => router.back()} />
      <motion.div
        layoutId={`article-${articleId}`}
        transition={{ duration: durations.normal, ease: easings.standard }}
        className="relative w-full max-w-4xl max-h-full overflow-y-auto bg-(--bg-primary) rounded-2xl border border-(--border) shadow-2xl z-10"
      >
        <button
          onClick={() => router.back()}
          className="absolute top-6 right-6 p-2 rounded-full bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] transition-colors z-20 text-(--text-secondary) hover:text-(--text-primary)"
        >
          <X className="w-6 h-6" />
        </button>
        <div className="p-8 md:p-12">
          {children}
        </div>
      </motion.div>
    </div>
  );
}
