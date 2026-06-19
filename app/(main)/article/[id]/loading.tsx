'use client';

import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

export default function ArticleLoading() {
  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-8 pb-20" aria-busy="true" role="status">
      <motion.div 
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex items-center gap-2 text-sm font-mono text-(--text-muted) w-fit opacity-50"
      >
        <ArrowLeft className="w-4 h-4" />
        <div className="w-24 h-4 bg-[rgba(255,255,255,0.05)] rounded animate-pulse" />
      </motion.div>
      
      <div className="space-y-4 mb-8">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
          className="w-3/4 h-12 md:h-16 bg-[rgba(255,255,255,0.03)] rounded-lg animate-pulse" 
        />
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15, ease: "easeOut" }}
          className="w-1/2 h-12 md:h-16 bg-[rgba(255,255,255,0.03)] rounded-lg animate-pulse" 
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
        className="relative w-full h-64 md:h-96 rounded-2xl mb-8 bg-[rgba(255,255,255,0.02)] overflow-hidden border border-[rgba(255,255,255,0.03)] flex items-center justify-center"
      >
         <motion.div 
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            className="w-10 h-10 border-2 border-[rgba(255,255,255,0.1)] border-t-[rgba(255,255,255,0.3)] rounded-full"
         />
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.25, ease: "easeOut" }}
        className="space-y-4"
      >
        <div className="w-full h-4 bg-[rgba(255,255,255,0.03)] rounded animate-pulse" />
        <div className="w-full h-4 bg-[rgba(255,255,255,0.03)] rounded animate-pulse" />
        <div className="w-11/12 h-4 bg-[rgba(255,255,255,0.03)] rounded animate-pulse" />
        <div className="w-full h-4 bg-[rgba(255,255,255,0.03)] rounded animate-pulse" />
        <div className="w-4/5 h-4 bg-[rgba(255,255,255,0.03)] rounded animate-pulse" />
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3, ease: "easeOut" }}
        className="space-y-4 mt-8"
      >
        <div className="w-full h-4 bg-[rgba(255,255,255,0.03)] rounded animate-pulse" />
        <div className="w-10/12 h-4 bg-[rgba(255,255,255,0.03)] rounded animate-pulse" />
        <div className="w-full h-4 bg-[rgba(255,255,255,0.03)] rounded animate-pulse" />
      </motion.div>
    </div>
  );
}
