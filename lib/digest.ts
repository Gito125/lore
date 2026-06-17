import { prisma } from '@/lib/db/prisma';

export interface WeeklyDigest {
  startDate: string;
  endDate: string;
  totalArticlesRead: number;
  totalTimeSpent: number; // seconds
  topTopics: string[];
  bookmarkedArticles: Array<{ id: string; title: string }>;
}

export async function generateWeeklyDigest(userId: string): Promise<WeeklyDigest> {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 7);

  // Fetch history for the last 7 days
  const recentHistory = await prisma.readingHistory.findMany({
    where: {
      userId,
      createdAt: {
        gte: startDate,
        lte: endDate
      }
    },
    select: {
      articleId: true,
      title: true,
      timeSpent: true
    }
  });

  const totalTimeSpent = recentHistory.reduce((acc, curr) => acc + curr.timeSpent, 0);
  const totalArticlesRead = recentHistory.length;

  // In a real app, we would map articles to their topics. 
  // For now, we'll fetch the user's top recent interests as a proxy for 'top topics this week'
  const topInterests = await prisma.interestGraph.findMany({
    where: { userId, updatedAt: { gte: startDate } },
    orderBy: { weight: 'desc' },
    take: 3,
    select: { topic: true }
  });

  // Fetch bookmarks created in the last 7 days
  const recentBookmarks = await prisma.bookmark.findMany({
    where: {
      userId,
      createdAt: { gte: startDate }
    },
    select: {
      articleId: true,
      title: true
    },
    take: 5
  });

  return {
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
    totalArticlesRead,
    totalTimeSpent,
    topTopics: topInterests.map(i => i.topic),
    bookmarkedArticles: recentBookmarks.map(b => ({ id: b.articleId, title: b.title }))
  };
}
