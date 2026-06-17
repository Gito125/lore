import { getRelatedArticles, type WikipediaArticle } from '@/lib/wikipedia/api';
import { rankArticles } from '@/lib/algorithm/scorer';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db/prisma';
import { z } from 'zod';

const recommendSchema = z.object({
  title: z.string().optional(),
  page: z.coerce.number().min(1).default(1)
});

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = session.user.id;

    const { searchParams } = new URL(request.url);
    const parsed = recommendSchema.safeParse({ 
      title: searchParams.get('title') || undefined,
      page: searchParams.get('page') || undefined
    });
    
    if (!parsed.success) {
      return Response.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const { title, page } = parsed.data;

    // If title is provided, fetch related articles (for sidebar)
    if (title) {
      const related = await getRelatedArticles(title);
      return Response.json({ recommendations: related.slice(0, 5) });
    }

    // Generate Feed based on user interests
    const userInterests = await prisma.interestGraph.findMany({
      where: { userId },
      orderBy: { weight: 'desc' },
      take: 3
    });

    let topicsToFetch = userInterests.map(i => i.topic);
    if (topicsToFetch.length === 0) {
      topicsToFetch = ['Science', 'History', 'Technology']; // Fallback topics
    }

    // Determine which topic to fetch based on page to simulate infinite scroll
    const topicIndex = (page - 1) % topicsToFetch.length;
    const currentTopic = topicsToFetch[topicIndex];

    const related = await getRelatedArticles(currentTopic);
    
    // Score the articles
    const context = {
      userInterests: userInterests.map(i => ({ topic: i.topic, weight: i.weight })),
      recentHistorySummaries: [], // Would fetch recent reading history summaries here
      sessionAvgReadTime: 180 
    };

    const scored = rankArticles(related, context);
    
    // Pagination slicing
    // page 1 -> first 10, page 2 -> next 10, etc.
    // However, we just fetched for one topic. A real feed might blend them.
    // For now, we take 10 articles from the fetched scored list
    const pageSize = 10;
    // We could just return the top 10
    const offset = Math.floor((page - 1) / topicsToFetch.length) * pageSize;
    const recommendations = scored.slice(offset, offset + pageSize);

    return Response.json({ recommendations, nextPage: page + 1 });
  } catch (err: unknown) {
    console.error('API Recommendations Error:', err);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
