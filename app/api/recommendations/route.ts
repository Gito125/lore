import { getRelatedArticles } from '@/lib/wikipedia/api';
import { z } from 'zod';

const recommendSchema = z.object({
  title: z.string().min(1)
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get('title');
    
    if (!title) {
      return Response.json({ error: 'Missing title parameter' }, { status: 400 });
    }

    const parsed = recommendSchema.safeParse({ title });
    
    if (!parsed.success) {
      return Response.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    // Fetch related articles from Wikipedia
    const related = await getRelatedArticles(parsed.data.title);
    
    // Take the top 5 for sidebar
    const recommendations = related.slice(0, 5);

    return Response.json({ recommendations });
  } catch (err: unknown) {
    console.error('API Recommendations Error:', err);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
