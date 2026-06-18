import { useEffect, useRef, useState, useCallback } from 'react';
import type { Article as WikipediaArticle } from '@/lib/services/article-service';
import type { ScoringContext, ScoredArticle } from '@/lib/algorithm/scorer';
import type { AlgorithmWorkerRequest, AlgorithmWorkerResponse } from '@/workers/algorithm.worker';

export function useAlgorithmWorker() {
  const workerRef = useRef<Worker | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Instantiate the worker
    // Next.js handles this syntax automatically with Webpack 5
    workerRef.current = new Worker(new URL('../workers/algorithm.worker.ts', import.meta.url), {
      type: 'module'
    });
    // eslint-disable-next-line
    setIsReady(true);

    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  const rankArticles = useCallback((
    articles: WikipediaArticle[], 
    context: ScoringContext
  ): Promise<ScoredArticle[]> => {
    return new Promise((resolve, reject) => {
      if (!workerRef.current) {
        return reject(new Error('Worker not initialized'));
      }

      const id = Math.random().toString(36).substring(7);
      
      const handleMessage = (event: MessageEvent<AlgorithmWorkerResponse>) => {
        if (event.data.id === id) {
          workerRef.current?.removeEventListener('message', handleMessage);
          
          if (event.data.error) {
            reject(new Error(event.data.error));
          } else {
            resolve(event.data.scoredArticles);
          }
        }
      };

      workerRef.current.addEventListener('message', handleMessage);
      
      const payload: AlgorithmWorkerRequest = { id, articles, context };
      workerRef.current.postMessage(payload);
    });
  }, []);

  return { rankArticles, isReady };
}
