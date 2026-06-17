import { auth } from '@/lib/auth';
import { z } from 'zod';
import { prisma } from '@/lib/db/prisma';
import { newId } from '@/lib/id';
import { updateTopicWeights } from '@/lib/algorithm/interest-graph';

const engageSchema = z.object({
  article_id: z.string().min(1),
  title: z.string().min(1).optional(),
  event_type: z.enum(['open', 'skip', 'bookmark', 'share', 'scroll_complete']),
  topics: z.array(z.string()).optional(),
  metadata: z.object({
    read_depth: z.number().min(0).max(1).optional(),
    time_spent: z.number().positive().optional(),
  }).optional()
});

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await request.json();
    const parsed = engageSchema.safeParse(body);
    
    if (!parsed.success) {
      return Response.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const { article_id, title, event_type, topics, metadata } = parsed.data;

    // 1. Record Engagement Event
    await prisma.engagementEvent.create({
      data: {
        id: newId(),
        userId,
        articleId: article_id,
        eventType: event_type,
        metadata: metadata ? metadata : undefined,
      }
    });

    // 2. Update Reading History for deep reads
    if (event_type === 'scroll_complete' || event_type === 'open') {
      const readDepth = metadata?.read_depth || 0;
      const timeSpent = metadata?.time_spent || 0;
      
      // If history exists for this article, update it
      const existingHistory = await prisma.readingHistory.findFirst({
        where: { userId, articleId: article_id }
      });

      if (existingHistory) {
        // Only update if the new read depth or time spent is greater
        if (readDepth > existingHistory.readDepth || timeSpent > existingHistory.timeSpent) {
          await prisma.readingHistory.update({
            where: { id: existingHistory.id },
            data: {
              readDepth: Math.max(readDepth, existingHistory.readDepth),
              timeSpent: Math.max(timeSpent, existingHistory.timeSpent)
            }
          });
        }
      } else if (title) {
        // Create new history
        await prisma.readingHistory.create({
          data: {
            id: newId(),
            userId,
            articleId: article_id,
            title,
            readDepth,
            timeSpent
          }
        });
      }
    }

    // 3. Update Interest Graph
    if (topics && topics.length > 0) {
      await updateTopicWeights(userId, topics, event_type);
    }

    return Response.json({ success: true });
  } catch (err: unknown) {
    console.error('API Engage Error:', err);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
