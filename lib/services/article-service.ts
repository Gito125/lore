import { z } from 'zod';

const WIKI_API_BASE = 'https://en.wikipedia.org/api/rest_v1/page';

export const WikipediaArticleSchema = z.object({
  id: z.string(),
  title: z.string(),
  extract: z.string().default(''),
  extract_html: z.string().default(''),
  thumbnail: z.object({
    source: z.string(),
    width: z.number(),
    height: z.number(),
  }).optional(),
  originalimage: z.object({
    source: z.string(),
    width: z.number(),
    height: z.number(),
  }).optional(),
  content_urls: z.object({
    desktop: z.object({ page: z.string(), revisions: z.string(), edit: z.string(), talk: z.string() }).optional(),
    mobile: z.object({ page: z.string(), revisions: z.string(), edit: z.string(), talk: z.string() }).optional(),
  }).optional(),
  categories: z.array(z.string()).optional(),
  wordCount: z.number().optional(),
  html: z.string().optional(),
  
  // Quality signals
  featured: z.boolean().optional(),
  goodArticle: z.boolean().optional(),
  citations: z.number().optional(),
  references: z.number().optional(),
  sectionCount: z.number().optional(),
});

export type Article = z.infer<typeof WikipediaArticleSchema>;

const MAX_RETRIES = 3;
const BASE_DELAY_MS = 500;
const FETCH_TIMEOUT_MS = 8000;

async function fetchWithRetry(url: string, options: RequestInit = {}): Promise<Response> {
  let lastError: Error | unknown;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
      
      const res = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);

      // Retry on rate limits (429) or server errors (5xx)
      if (res.status === 429 || res.status >= 500) {
        lastError = new Error(`Wikipedia API responded with status ${res.status}`);
      } else {
        return res;
      }
    } catch (error) {
      lastError = error;
    }

    // Exponential backoff: 500ms, 1000ms, 2000ms
    const delay = BASE_DELAY_MS * Math.pow(2, attempt);
    await new Promise(resolve => setTimeout(resolve, delay));
  }

  throw lastError;
}

export async function getArticle(title: string): Promise<Article | null> {
  if (process.env.USE_MOCK_WIKI === 'true') {
    return {
      id: title,
      title,
      extract: `Mock extract for ${title}`,
      extract_html: `<p>Mock extract for ${title}</p>`,
      categories: ['Mock'],
      wordCount: 500,
      html: `<h2>Mock HTML for ${title}</h2><p>This is a mock article for testing purposes.</p>`,
      thumbnail: { source: 'https://placehold.co/400x300', width: 400, height: 300 }
    };
  }

  try {
    const encodedTitle = encodeURIComponent(title);
    
    // Using Next.js fetch caching directly
    const res = await fetchWithRetry(`${WIKI_API_BASE}/summary/${encodedTitle}`, {
      headers: {
        'User-Agent': 'LoreApp/1.0 (Contact: admin@example.com)'
      },
      next: { revalidate: 3600 } 
    });

    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error(`Wikipedia API responded with ${res.status}`);
    }

    const data = await res.json();
    
    // Transform and structure the response
    const articleParsed = WikipediaArticleSchema.safeParse({
      id: data.title,
      title: data.title,
      extract: data.extract,
      extract_html: data.extract_html,
      thumbnail: data.thumbnail,
      originalimage: data.originalimage,
      content_urls: data.content_urls,
    });

    if (!articleParsed.success) {
      console.error('Validation failed for article summary:', articleParsed.error);
      return null;
    }

    return articleParsed.data;
  } catch (error) {
    console.error(`Error fetching Wikipedia article ${title}:`, error);
    return null;
  }
}

export async function getRecommendations(title: string): Promise<Article[]> {
  if (process.env.USE_MOCK_WIKI === 'true') {
    return Array.from({ length: 15 }).map((_, i) => ({
      id: `mock-${title}-${i}`,
      title: `${title} Mock Related ${i}`,
      extract: `Mock related extract for ${title} ${i}`,
      extract_html: `<p>Mock related extract for ${title} ${i}</p>`,
      categories: ['Mock'],
      wordCount: 300,
      thumbnail: { source: 'https://placehold.co/400x300', width: 400, height: 300 }
    }));
  }

  try {
    const encodedTitle = encodeURIComponent(title);
    const url = `https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodedTitle}&gsrlimit=15&prop=extracts|pageimages|categories&exchars=300&exintro=1&piprop=thumbnail&pithumbsize=400&format=json`;
    
    const res = await fetchWithRetry(url, {
      headers: {
        'User-Agent': 'LoreApp/1.0 (Contact: admin@example.com)'
      },
      next: { revalidate: 3600 }
    });

    if (!res.ok) {
      return [];
    }

    const data = await res.json();
    if (!data.query || !data.query.pages) {
      return [];
    }

    const pages = Object.values(data.query.pages) as any[];
    
    const articles = pages.map((page) => {
      const pageTitleEncoded = encodeURIComponent(page.title);
      const extractHtml = page.extract || '';
      const extractText = extractHtml.replace(/<[^>]*>?/gm, ''); 
      
      const categories = page.categories 
        ? page.categories.map((c: any) => c.title.replace(/^Category:/, ''))
        : [];

      return {
        id: page.title,
        title: page.title,
        extract: extractText,
        extract_html: extractHtml,
        thumbnail: page.thumbnail ? {
          source: page.thumbnail.source,
          width: page.thumbnail.width,
          height: page.thumbnail.height,
        } : undefined,
        categories: categories,
        content_urls: {
          desktop: { 
            page: `https://en.wikipedia.org/wiki/${pageTitleEncoded}`, 
            revisions: '', edit: '', talk: '' 
          },
          mobile: { 
            page: `https://en.m.wikipedia.org/wiki/${pageTitleEncoded}`, 
            revisions: '', edit: '', talk: '' 
          }
        },
      };
    });

    const parsedArticles = z.array(WikipediaArticleSchema).safeParse(articles);
    if (!parsedArticles.success) {
      console.error('Validation failed for recommendations:', parsedArticles.error);
      return [];
    }
    return parsedArticles.data;

  } catch (error) {
    console.error(`Error fetching related articles for ${title}:`, error);
    return [];
  }
}

export async function getFullArticle(title: string): Promise<Article | null> {
  if (process.env.USE_MOCK_WIKI === 'true') {
    return getArticle(title);
  }

  try {
    const summary = await getArticle(title);
    if (!summary) return null;

    const encodedTitle = encodeURIComponent(title);
    const res = await fetchWithRetry(`https://en.wikipedia.org/w/api.php?action=parse&page=${encodedTitle}&format=json&prop=text`, {
      headers: {
        'User-Agent': 'LoreApp/1.0 (Contact: admin@example.com)'
      },
      next: { revalidate: 3600 }
    });

    if (!res.ok) {
      return summary;
    }

    const data = await res.json();
    if (data.parse && data.parse.text) {
      summary.html = data.parse.text['*'];
    }

    return summary;
  } catch (error) {
    console.error(`Error fetching full Wikipedia article ${title}:`, error);
    return null; 
  }
}

export async function searchArticles(query: string, limit: number = 10): Promise<any[]> {
  try {
    const url = `https://en.wikipedia.org/w/rest.php/v1/search/page?q=${encodeURIComponent(query.trim())}&limit=${limit}`;
    const res = await fetchWithRetry(url, {
      headers: {
        'User-Agent': 'LoreApp/1.0 (Contact: admin@example.com)'
      },
      next: { revalidate: 3600 }
    });
    if (!res.ok) return [];
    const data = await res.json();
    // Validate or just return
    return data?.pages || [];
  } catch (error) {
    console.error('Search error:', error);
    return [];
  }
}
