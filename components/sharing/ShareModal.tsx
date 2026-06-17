'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Hash, Link2, Camera, MessageCircle } from 'lucide-react';
import { generateTwitterIntent } from '@/lib/sharing/twitter';
import { useState } from 'react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  articleId: string;
  title: string;
  summary: string;
}

export function ShareModal({ isOpen, onClose, articleId, title, summary }: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const articleUrl = typeof window !== 'undefined' ? `${window.location.origin}/article/${articleId}` : '';

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(articleUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error('Failed to copy', e);
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      try {
        await navigator.share({
          title: `Lore: ${title}`,
          text: summary,
          url: articleUrl,
        });
        onClose();
      } catch (e) {
        console.error('Share failed', e);
      }
    }
  };

  const twitterUrl = generateTwitterIntent(title, summary, articleUrl);
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`Check out this article on Lore: ${title}\n${articleUrl}`)}`;
  const instagramUrl = `/api/share/story?title=${encodeURIComponent(title)}&summary=${encodeURIComponent(summary)}`;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.95 }}
            className="fixed bottom-0 left-0 right-0 md:bottom-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-md bg-(--bg-card) border border-(--border) rounded-t-2xl md:rounded-2xl p-6 z-50 flex flex-col gap-6"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-serif text-(--text-primary)">Share Article</h3>
              <button onClick={onClose} className="text-(--text-muted) hover:text-(--text-primary) transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-4 gap-4">
              <a href={twitterUrl} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2 group">
                <div className="w-12 h-12 rounded-full bg-[rgba(255,255,255,0.04)] border border-(--border) group-hover:border-[rgba(255,255,255,0.2)] flex items-center justify-center text-(--text-primary) transition-all">
                  <Hash size={20} />
                </div>
                <span className="text-xs font-mono text-(--text-muted)">X/Twitter</span>
              </a>
              
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2 group">
                <div className="w-12 h-12 rounded-full bg-[rgba(255,255,255,0.04)] border border-(--border) group-hover:border-[rgba(255,255,255,0.2)] flex items-center justify-center text-(--text-primary) transition-all">
                  <MessageCircle size={20} />
                </div>
                <span className="text-xs font-mono text-(--text-muted)">WhatsApp</span>
              </a>

              <a href={instagramUrl} download className="flex flex-col items-center gap-2 group">
                <div className="w-12 h-12 rounded-full bg-[rgba(255,255,255,0.04)] border border-(--border) group-hover:border-[rgba(255,255,255,0.2)] flex items-center justify-center text-(--text-primary) transition-all">
                  <Camera size={20} />
                </div>
                <span className="text-xs font-mono text-(--text-muted)">IG Story</span>
              </a>

              <button onClick={handleCopyLink} className="flex flex-col items-center gap-2 group">
                <div className="w-12 h-12 rounded-full bg-[rgba(255,255,255,0.04)] border border-(--border) group-hover:border-[rgba(255,255,255,0.2)] flex items-center justify-center text-(--text-primary) transition-all">
                  <Link2 size={20} />
                </div>
                <span className="text-xs font-mono text-(--text-muted)">{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>

            {typeof navigator !== 'undefined' && typeof navigator.share === 'function' && (
              <button 
                onClick={handleNativeShare}
                className="w-full py-3 rounded-lg border border-(--border) hover:bg-[rgba(255,255,255,0.04)] text-sm font-mono text-(--text-primary) transition-colors mt-2"
              >
                More Options...
              </button>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
