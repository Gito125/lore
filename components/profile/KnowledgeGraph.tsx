'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface Topic {
  id: string;
  topic: string;
  weight: number;
}

export function KnowledgeGraph({ topics }: { topics: Topic[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current || topics.length === 0) return;
    
    const ctx = gsap.context(() => {
      const nodes = gsap.utils.toArray('.kg-node') as HTMLElement[];
      const centerX = containerRef.current!.offsetWidth / 2;
      const centerY = containerRef.current!.offsetHeight / 2;
      const radius = Math.min(centerX, centerY) - 40;
      
      nodes.forEach((node, i) => {
        const angle = (i / nodes.length) * Math.PI * 2;
        const x = centerX + radius * Math.cos(angle) - node.offsetWidth / 2;
        const y = centerY + radius * Math.sin(angle) - node.offsetHeight / 2;
        
        gsap.fromTo(node, 
          { x: centerX - node.offsetWidth / 2, y: centerY - node.offsetHeight / 2, scale: 0, opacity: 0 },
          { x, y, scale: 1, opacity: 1, duration: 1.5, ease: 'back.out(1.2)', delay: i * 0.1 }
        );
      });
    }, containerRef);
    
    return () => ctx.revert();
  }, [topics]);

  if (topics.length === 0) return null;

  return (
    <div className="relative w-full h-[300px] bg-(--bg-card) border border-(--border) rounded-xl overflow-hidden my-6" ref={containerRef}>
      {topics.map((t, i) => (
        <div 
          key={t.id} 
          className="kg-node absolute px-4 py-2 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-full text-sm font-mono text-(--text-primary) whitespace-nowrap shadow-lg backdrop-blur-sm"
          style={{ zIndex: topics.length - i }}
        >
          {t.topic}
          <span className="ml-2 text-(--text-muted) text-xs">{(t.weight * 100).toFixed(0)}</span>
        </div>
      ))}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-(--accent) opacity-20 blur-xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xs font-mono text-(--text-muted) uppercase tracking-widest">
        Core
      </div>
    </div>
  );
}
