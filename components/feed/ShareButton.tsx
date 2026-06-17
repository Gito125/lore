'use client';

import { Share2 } from 'lucide-react';
import { useState } from 'react';
import { ShareModal } from '@/components/sharing/ShareModal';

interface ShareButtonProps {
  articleId: string;
  title: string;
  summary: string;
}

export function ShareButton({ articleId, title, summary }: ShareButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button 
        onClick={(e) => {
          e.preventDefault();
          setIsModalOpen(true);
        }}
        className="p-2 rounded-full text-(--text-muted) hover:text-(--text-primary) hover:bg-[rgba(255,255,255,0.04)] transition-all"
        aria-label="Share article"
      >
        <Share2 size={16} />
      </button>
      
      <ShareModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        articleId={articleId} 
        title={title} 
        summary={summary} 
      />
    </>
  );
}
