import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db/prisma';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const userId = session.user.id;

    const [bookmarksCount, historyAggregation, topTopics] = await Promise.all([
      prisma.bookmark.count({ where: { userId } }),
      prisma.readingHistory.aggregate({
        where: { userId },
        _sum: { timeSpent: true },
        _count: { id: true }
      }),
      prisma.interestGraph.findMany({
        where: { userId },
        orderBy: { weight: 'desc' },
        take: 5,
        select: { topic: true, weight: true }
      })
    ]);

    const stats = {
      bookmarksCount,
      articlesRead: historyAggregation._count.id || 0,
      totalReadTime: historyAggregation._sum.timeSpent || 0, // in seconds
      topTopics: topTopics.map(t => t.topic)
    };

    return Response.json({ stats });
  } catch (error) {
    console.error('Failed to fetch stats:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
