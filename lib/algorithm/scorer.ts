import type { WikipediaArticle } from '../wikipedia/api';
import { calculateSemanticSimilarity } from './semantic';
import { calculateSerendipityScore, type TopicWeight } from './serendipity';

export interface ScoringContext {
  userInterests: TopicWeight[];
  recentHistorySummaries: string[];
  sessionAvgReadTime: number; // in seconds
  userReadingSpeedWpm?: number;
}

export interface ScoredArticle extends WikipediaArticle {
  score: number;
  scoreBreakdown: {
    interest: number;
    velocity: number;
    semantic: number;
    quality: number;
    serendipity: number;
    novelty: number;
  };
}

function calculateQualityScore(article: WikipediaArticle): number {
  let score = 0.3; // Base score
  
  if (article.thumbnail || article.originalimage) score += 0.1;
  if (article.wordCount && article.wordCount > 2000) score += 0.1;
  if (article.wordCount && article.wordCount > 5000) score += 0.1;

  // New strong signals
  if (article.featured) score += 0.4;
  else if (article.goodArticle) score += 0.2;

  if (article.citations && article.citations > 20) score += 0.1;
  if (article.references && article.references > 10) score += 0.1;
  if (article.sectionCount && article.sectionCount > 5) score += 0.1;

  return Math.min(1.0, score);
}

function calculateVelocityScore(article: WikipediaArticle, avgReadTime: number, wpm: number): number {
  if (!article.wordCount) return 0.5;
  
  const estimatedReadTime = article.wordCount / wpm; // minutes
  const estimatedReadSeconds = estimatedReadTime * 60;
  
  if (avgReadTime === 0) return 0.5; 
  
  const ratio = estimatedReadSeconds / avgReadTime;
  const score = Math.max(0, 1.0 - Math.abs(1.0 - ratio) * 0.2);
  
  return Math.min(1.0, score);
}

function calculateCategoryInterestScore(article: WikipediaArticle, userInterests: TopicWeight[]): number {
  if (!article.categories || article.categories.length === 0) return 0.2;
  
  let maxWeight = 0;
  const now = new Date().getTime();

  for (const cat of article.categories) {
    const match = userInterests.find(i => i.topic.toLowerCase() === cat.toLowerCase());
    if (match) {
      let weight = match.weight;
      // Recency boost
      if (match.lastHit) {
        const daysOld = (now - match.lastHit.getTime()) / (1000 * 60 * 60 * 24);
        if (daysOld < 1) weight *= 1.2; // 20% boost for very recent
        else if (daysOld < 7) weight *= 1.1; // 10% boost for this week
      }
      if (weight > maxWeight) {
        maxWeight = weight;
      }
    }
  }
  
  return Math.min(1.0, maxWeight);
}

export function scoreArticle(article: WikipediaArticle, context: ScoringContext): ScoredArticle {
  const isPowerUser = context.recentHistorySummaries.length > 5;
  const weights = isPowerUser ? {
    INTEREST: 0.35,
    SEMANTIC: 0.20,
    QUALITY: 0.15,
    SERENDIPITY: 0.10,
    VELOCITY: 0.10,
    NOVELTY: 0.10,
  } : {
    QUALITY: 0.35,
    SERENDIPITY: 0.20,
    INTEREST: 0.10,
    VELOCITY: 0.15,
    SEMANTIC: 0.05,
    NOVELTY: 0.15,
  };

  const interest = calculateCategoryInterestScore(article, context.userInterests);
  const velocity = calculateVelocityScore(article, context.sessionAvgReadTime, context.userReadingSpeedWpm || 250);
  
  let semantic = 0;
  if (context.recentHistorySummaries.length > 0) {
    const scores = context.recentHistorySummaries.map(summary => 
      calculateSemanticSimilarity(article.extract, summary)
    );
    semantic = scores.reduce((a, b) => a + b, 0) / scores.length;
  } else {
    semantic = 0.5; // Neutral if no history
  }
  
  const quality = calculateQualityScore(article);
  const serendipity = calculateSerendipityScore(article.categories || [], context.userInterests);
  
  const novelty = 1.0 - semantic;

  const totalScore = 
    (interest * weights.INTEREST) +
    (velocity * weights.VELOCITY) +
    (semantic * weights.SEMANTIC) +
    (quality * weights.QUALITY) +
    (serendipity * weights.SERENDIPITY) +
    (novelty * weights.NOVELTY);

  return {
    ...article,
    score: totalScore,
    scoreBreakdown: {
      interest,
      velocity,
      semantic,
      quality,
      serendipity,
      novelty
    }
  };
}

export function rankArticles(articles: WikipediaArticle[], context: ScoringContext): ScoredArticle[] {
  let scored = articles.map(a => scoreArticle(a, context));
  scored = scored.sort((a, b) => b.score - a.score);

  const top20 = scored.slice(0, 20);
  const rest = scored.slice(20);

  const reRankedTop20: ScoredArticle[] = [];
  const recentCategories = new Set<string>();

  while (top20.length > 0) {
    let bestIndex = 0;
    let bestAdjustedScore = -1;

    for (let i = 0; i < top20.length; i++) {
      const article = top20[i];
      let penalty = 1.0;
      
      if (article.categories && article.categories.length > 0) {
        if (recentCategories.has(article.categories[0])) {
          penalty = 0.7; // 30% penalty
        }
      }

      const adjustedScore = article.score * penalty;
      if (adjustedScore > bestAdjustedScore) {
        bestAdjustedScore = adjustedScore;
        bestIndex = i;
      }
    }

    const selected = top20.splice(bestIndex, 1)[0];
    reRankedTop20.push(selected);
    
    if (selected.categories && selected.categories.length > 0) {
      recentCategories.add(selected.categories[0]);
      if (recentCategories.size > 3) {
        const first = Array.from(recentCategories)[0];
        recentCategories.delete(first);
      }
    }
  }

  return [...reRankedTop20, ...rest];
}
