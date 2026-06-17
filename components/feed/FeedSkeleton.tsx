'use client';

import { motion } from 'framer-motion';
import clsx from 'clsx';
import { easings } from '@/lib/motion/easings';

export function FeedSkeleton() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-2xl mx-auto py-12 px-4 md:px-0">
      {[1, 2, 3, 4].map((i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: i * 0.1, ease: easings.standard }}
          className={clsx(
            'flex flex-col gap-4 p-6',
            'bg-[rgba(255,255,255,0.02)] rounded-xl',
            'border border-[rgba(255,255,255,0.03)]'
          )}
        >
          <div className="flex justify-between items-center">
            <div className="h-3 w-16 bg-[rgba(255,255,255,0.05)] rounded-full animate-pulse" />
            <div className="h-3 w-20 bg-[rgba(255,255,255,0.05)] rounded-full animate-pulse" />
          </div>
          <div className="h-8 w-3/4 bg-[rgba(255,255,255,0.06)] rounded-md mt-2 animate-pulse" />
          <div className="flex flex-col gap-2 mt-3">
            <div className="h-4 w-full bg-[rgba(255,255,255,0.04)] rounded-md animate-pulse" />
            <div className="h-4 w-5/6 bg-[rgba(255,255,255,0.04)] rounded-md animate-pulse" />
            <div className="h-4 w-4/6 bg-[rgba(255,255,255,0.04)] rounded-md animate-pulse" />
          </div>
          <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-[rgba(255,255,255,0.03)]">
            <div className="h-8 w-8 rounded-full bg-[rgba(255,255,255,0.05)] animate-pulse" />
            <div className="h-8 w-8 rounded-full bg-[rgba(255,255,255,0.05)] animate-pulse" />
          </div>
        </motion.div>
      ))}
    </div>
  );
}
