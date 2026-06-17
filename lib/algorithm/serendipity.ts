export interface TopicWeight {
  topic: string;
  weight: number;
}

/**
 * Calculates a serendipity score for a candidate article based on the user's interest graph.
 * 
 * Serendipity is about showing the user things outside their established preferences
 * (filter bubble). If an article's topic is outside their top 5 topics, it gets a higher score.
 */
export function calculateSerendipityScore(
  articleTopics: string[],
  userInterests: TopicWeight[]
): number {
  if (articleTopics.length === 0) return 0.5; // Neutral if we don't know the topic

  // Sort user interests by weight descending to find top topics
  const sortedInterests = [...userInterests].sort((a, b) => b.weight - a.weight);
  
  // Top 5 topics are considered the user's "bubble"
  const topTopics = new Set(sortedInterests.slice(0, 5).map(i => i.topic.toLowerCase()));

  let outsideBubbleCount = 0;
  for (const topic of articleTopics) {
    if (!topTopics.has(topic.toLowerCase())) {
      outsideBubbleCount++;
    }
  }

  // If the article has topics entirely outside their bubble, it's highly serendipitous
  const serendipityRatio = outsideBubbleCount / articleTopics.length;

  return serendipityRatio; // 0.0 to 1.0
}
