import type { WikipediaArticle } from '../wikipedia/api';
import { calculateSemanticSimilarity } from './semantic';
import { calculateSerendipityScore, type TopicWeight } from './serendipity';

export interface ScoringContext {
  userInterests: TopicWeight[];
  recentHistorySummaries: string[];
  sessionAvgReadTime: number; // in seconds
}

export interface ScoredArticle extends WikipediaArticle {
  score: number;
  scoreBreakdown: {
    interest: number;
    velocity: number;
    semantic: number;
    quality: number;
    serendipity: number;
  };
}

const WEIGHTS = {
  INTEREST: 0.30,
  VELOCITY: 0.25,
  SEMANTIC: 0.20,
  QUALITY: 0.15,
  SERENDIPITY: 0.10,
};

function calculateQualityScore(article: WikipediaArticle): number {
  let score = 0.5; // Base score
  
  if (article.thumbnail) score += 0.2; // Has image
  if (article.wordCount && article.wordCount > 2000) score += 0.2;
  if (article.wordCount && article.wordCount > 5000) score += 0.1;

  // Cap at 1.0
  return Math.min(1.0, score);
}

function calculateVelocityScore(article: WikipediaArticle, avgReadTime: number): number {
  // If user is reading fast (low avg read time), prefer shorter articles
  // If user is spending a long time, prefer longer articles
  if (!article.wordCount) return 0.5;
  
  const estimatedReadTime = article.wordCount / 250; // 250 WPM -> minutes
  const estimatedReadSeconds = estimatedReadTime * 60;
  
  if (avgReadTime === 0) return 0.5; // No data yet
  
  // Ratio of article length to current reading velocity
  const ratio = estimatedReadSeconds / avgReadTime;
  
  // Perfect match is ratio around 1.0
  // Score drops off as ratio moves away from 1.0
  const score = Math.max(0, 1.0 - Math.abs(1.0 - ratio) * 0.2);
  
  return Math.min(1.0, score);
}

function calculateCategoryInterestScore(article: WikipediaArticle, userInterests: TopicWeight[]): number {
  if (!article.categories || article.categories.length === 0) return 0.2; // Default low-ish score
  
  let maxWeight = 0;
  for (const cat of article.categories) {
    const match = userInterests.find(i => i.topic.toLowerCase() === cat.toLowerCase());
    if (match && match.weight > maxWeight) {
      maxWeight = match.weight;
    }
  }
  
  return maxWeight;
}

export function scoreArticle(article: WikipediaArticle, context: ScoringContext): ScoredArticle {
  const interest = calculateCategoryInterestScore(article, context.userInterests);
  const velocity = calculateVelocityScore(article, context.sessionAvgReadTime);
  
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

  const totalScore = 
    (interest * WEIGHTS.INTEREST) +
    (velocity * WEIGHTS.VELOCITY) +
    (semantic * WEIGHTS.SEMANTIC) +
    (quality * WEIGHTS.QUALITY) +
    (serendipity * WEIGHTS.SERENDIPITY);

  return {
    ...article,
    score: totalScore,
    scoreBreakdown: {
      interest,
      velocity,
      semantic,
      quality,
      serendipity
    }
  };
}

export function rankArticles(articles: WikipediaArticle[], context: ScoringContext): ScoredArticle[] {
  return articles
    .map(a => scoreArticle(a, context))
    .sort((a, b) => b.score - a.score);
}
