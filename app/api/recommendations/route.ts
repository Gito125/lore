import { auth } from '@/lib/auth';
import { z } from 'zod';
import { generateRandomFeed } from '@/lib/feed/generator';
import { getRecommendations } from '@/lib/services/article-service';
import arcjet, { tokenBucket } from '@arcjet/next';

const aj = arcjet({
  key: process.env.ARCJET_KEY || 'ajkey_test_123', // required
  characteristics: ['ip.src'],
  rules: [
    tokenBucket({
      mode: 'LIVE',
      refillRate: 5,
      interval: 10,
      capacity: 10,
    }),
  ],
});

const recommendSchema = z.object({
  title: z.string().optional(),
  page: z.coerce.number().min(1).default(1)
});

export async function GET(request: Request) {
  try {
    const decision = await aj.protect(request, { requested: 1 });
    if (decision.isDenied()) {
      return Response.json({ error: 'Too Many Requests' }, { status: 429 });
    }

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
      const related = await getRecommendations(title);
      return Response.json({ recommendations: related.slice(0, 5) });
    }

    // Generate Feed using the centralized random generator
    const recommendations = await generateRandomFeed(userId, 10);

    return Response.json({ recommendations, nextPage: page + 1 });
  } catch (err: unknown) {
    console.error('API Recommendations Error:', err);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

