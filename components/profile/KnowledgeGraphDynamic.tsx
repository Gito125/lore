'use client';

import dynamic from 'next/dynamic';

export const KnowledgeGraphDynamic = dynamic(
  () => import('./KnowledgeGraph').then(mod => mod.KnowledgeGraph),
  { ssr: false, loading: () => <div className="w-full h-[300px] animate-pulse bg-[rgba(255,255,255,0.02)] rounded-xl my-6" /> }
);
