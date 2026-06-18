import { z } from 'zod';
import { searchArticles } from '@/lib/services/article-service';
import arcjet, { tokenBucket } from '@arcjet/next';

const aj = arcjet({
  key: process.env.ARCJET_KEY || 'ajkey_test_123',
  characteristics: ['ip.src'],
  rules: [
    tokenBucket({
      mode: 'LIVE',
      refillRate: 10,
      interval: 10,
      capacity: 20,
    }),
  ],
});

const searchSchema = z.object({
  q: z.string().min(1),
  limit: z.coerce.number().default(10)
});

export async function GET(request: Request) {
  try {
    const decision = await aj.protect(request, { requested: 1 });
    if (decision.isDenied()) {
      return Response.json({ error: 'Too Many Requests' }, { status: 429 });
    }

    const { searchParams } = new URL(request.url);
    const parsed = searchSchema.safeParse({
      q: searchParams.get('q') || undefined,
      limit: searchParams.get('limit') || undefined
    });

    if (!parsed.success) {
      return Response.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const { q, limit } = parsed.data;
    
    const data = await searchArticles(q, limit);
    return Response.json({ pages: data });
  } catch (error) {
    console.error('Search error:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

