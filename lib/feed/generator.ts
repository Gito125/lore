import { prisma } from '@/lib/db/prisma';
import { getRelatedArticles, type WikipediaArticle } from '@/lib/wikipedia/api';
import { rankArticles } from '@/lib/algorithm/scorer';

export async function generateRandomFeed(userId: string, count: number = 10) {
  const userInterests = await prisma.interestGraph.findMany({
    where: { userId }
  });

  let topicsToFetch = userInterests.map(i => i.topic);
  if (topicsToFetch.length === 0) {
    topicsToFetch = ['Science', 'History', 'Technology', 'Art', 'Philosophy', 'Space Exploration'];
  }

  // Shuffle and pick 2 topics max to prevent Wikipedia API ETIMEDOUT / rate limiting
  const shuffledTopics = topicsToFetch.sort(() => 0.5 - Math.random());
  const selectedTopics = shuffledTopics.slice(0, Math.min(2, shuffledTopics.length));

  // Fetch articles for these topics sequentially to avoid connection overload
  const relatedArrays = [];
  for (const topic of selectedTopics) {
    const articles = await getRelatedArticles(topic);
    relatedArrays.push(articles);
  }
  const related = relatedArrays.flat();

  // Get articles the user has explicitly interacted with (excluding simple opens/impressions)
  const interacted = await prisma.engagementEvent.findMany({
    where: { userId, eventType: { in: ['share', 'bookmark', 'like', 'skip'] } },
    select: { articleId: true }
  });
  const bookmarked = await prisma.bookmark.findMany({
    where: { userId },
    select: { articleId: true }
  });
  const liked = await prisma.like.findMany({
    where: { userId },
    select: { articleId: true }
  });

  const excludeIds = new Set([
    ...interacted.map(e => e.articleId),
    ...bookmarked.map(b => b.articleId),
    ...liked.map(l => l.articleId)
  ]);

  const context = {
    userInterests: userInterests.map(i => ({ topic: i.topic, weight: i.weight })),
    recentHistorySummaries: [], 
    sessionAvgReadTime: 180 
  };

  const scored = rankArticles(related, context);
  
  // Filter out interacted articles, shuffle slightly for randomness, and slice
  const recommendations = scored
    .filter(a => !excludeIds.has(a.id))
    // We shuffle top 30 to add serendipity before slicing
    .slice(0, 30)
    .sort(() => 0.5 - Math.random())
    .slice(0, count);

  return recommendations.map((article: WikipediaArticle) => ({
    id: article.id,
    title: article.title,
    extract: article.extract,
    imageUrl: article.originalimage?.source || article.thumbnail?.source,
    readTime: article.wordCount ? Math.max(1, Math.ceil(article.wordCount / 250)) : 5,
    category: article.categories?.[0] || 'Uncategorized',
  }));
}
