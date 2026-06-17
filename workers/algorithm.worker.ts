import type { WikipediaArticle } from '../lib/wikipedia/api';
import { rankArticles, type ScoringContext, type ScoredArticle } from '../lib/algorithm/scorer';

export interface AlgorithmWorkerRequest {
  id: string;
  articles: WikipediaArticle[];
  context: ScoringContext;
}

export interface AlgorithmWorkerResponse {
  id: string;
  scoredArticles: ScoredArticle[];
  error?: string;
}

self.onmessage = (event: MessageEvent<AlgorithmWorkerRequest>) => {
  try {
    const { id, articles, context } = event.data;
    
    // Sort and rank the articles off the main thread
    const scoredArticles = rankArticles(articles, context);
    
    self.postMessage({
      id,
      scoredArticles
    } as AlgorithmWorkerResponse);
    
  } catch (err: unknown) {
    self.postMessage({
      id: event.data?.id,
      scoredArticles: [],
      error: err instanceof Error ? err.message : 'Unknown error'
    } as AlgorithmWorkerResponse);
  }
};
