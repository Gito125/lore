import { z } from 'zod';

const searchSchema = z.object({
  q: z.string().min(1),
  limit: z.coerce.number().default(10)
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const parsed = searchSchema.safeParse({
      q: searchParams.get('q') || undefined,
      limit: searchParams.get('limit') || undefined
    });

    if (!parsed.success) {
      return Response.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const { q, limit } = parsed.data;
    
    // Wikipedia REST API for search
    const url = `https://en.wikipedia.org/w/rest.php/v1/search/page?q=${encodeURIComponent(q)}&limit=${limit}`;
    
    // Retry logic
    let res: Response | null = null;
    let lastError: Error | unknown;
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);
        res = await fetch(url, {
          headers: {
            'User-Agent': 'LoreApp/1.0 (Contact: admin@example.com)'
          },
          signal: controller.signal
        });
        clearTimeout(timeoutId);
        
        if (res.status !== 429 && res.status < 500) {
          break;
        }
      } catch (error) {
        lastError = error;
      }
      await new Promise(resolve => setTimeout(resolve, 500 * Math.pow(2, attempt)));
    }

    if (!res || !res.ok) {
      throw lastError || new Error(`Wikipedia search failed with status ${res?.status}`);
    }

    const data = await res.json();
    return Response.json(data);
  } catch (error) {
    console.error('Search error:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
