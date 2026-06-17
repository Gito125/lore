const WIKI_API_BASE = 'https://en.wikipedia.org/api/rest_v1/page';

export interface WikipediaArticle {
  id: string;
  title: string;
  extract: string;
  extract_html: string;
  thumbnail?: {
    source: string;
    width: number;
    height: number;
  };
  content_urls: {
    desktop: { page: string; revisions: string; edit: string; talk: string };
    mobile: { page: string; revisions: string; edit: string; talk: string };
  };
  categories?: string[];
  wordCount?: number;
  html?: string;
}

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

export async function getWikipediaArticleSummary(title: string): Promise<WikipediaArticle | null> {
  if (process.env.NEXT_PUBLIC_TEST_MODE === 'true') {
    return {
      id: title,
      title,
      extract: `Mock extract for ${title}`,
      extract_html: `<p>Mock extract for ${title}</p>`,
      content_urls: { desktop: { page: '#', revisions: '#', edit: '#', talk: '#' }, mobile: { page: '#', revisions: '#', edit: '#', talk: '#' } },
      categories: ['Mock'],
      wordCount: 500,
      html: `<h2>Mock HTML for ${title}</h2><p>This is a mock article for testing purposes.</p>`,
      thumbnail: { source: 'https://placehold.co/400x300', width: 400, height: 300 }
    };
  }

  try {
    const encodedTitle = encodeURIComponent(title);
    const res = await fetchWithRetry(`${WIKI_API_BASE}/summary/${encodedTitle}`, {
      headers: {
        'User-Agent': 'LoreApp/1.0 (Contact: admin@example.com)'
      },
      // Using Next.js fetch caching directly
      // next: { revalidate: 3600 } 
    });

    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error(`Wikipedia API responded with ${res.status}`);
    }

    const data = await res.json();
    
    // Transform and structure the response
    const article: WikipediaArticle = {
      id: data.pageid?.toString() || title,
      title: data.title,
      extract: data.extract,
      extract_html: data.extract_html,
      thumbnail: data.thumbnail,
      content_urls: data.content_urls,
    };

    return article;
  } catch (error) {
    console.error(`Error fetching Wikipedia article ${title}:`, error);
    return null;
  }
}

export async function getRelatedArticles(title: string): Promise<WikipediaArticle[]> {
  if (process.env.NEXT_PUBLIC_TEST_MODE === 'true') {
    return Array.from({ length: 15 }).map((_, i) => ({
      id: `mock-${title}-${i}`,
      title: `${title} Mock Related ${i}`,
      extract: `Mock related extract for ${title} ${i}`,
      extract_html: `<p>Mock related extract for ${title} ${i}</p>`,
      content_urls: { desktop: { page: '#', revisions: '#', edit: '#', talk: '#' }, mobile: { page: '#', revisions: '#', edit: '#', talk: '#' } },
      categories: ['Mock'],
      wordCount: 300,
      thumbnail: { source: 'https://placehold.co/400x300', width: 400, height: 300 }
    }));
  }

  try {
    const encodedTitle = encodeURIComponent(title);
    // Use the Action API to search for related articles since the REST API /related endpoint is decommissioned
    const url = `https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodedTitle}&gsrlimit=15&prop=extracts|pageimages|categories&exchars=300&exintro=1&piprop=thumbnail&pithumbsize=400&format=json`;
    
    const res = await fetchWithRetry(url, {
      headers: {
        'User-Agent': 'LoreApp/1.0 (Contact: admin@example.com)'
      },
      next: { revalidate: 3600 }
    } as RequestInit);

    if (!res.ok) {
      return [];
    }

    const data = await res.json();
    if (!data.query || !data.query.pages) {
      return [];
    }

    interface ActionApiPage {
      pageid: number;
      title: string;
      extract?: string;
      thumbnail?: { source: string; width: number; height: number };
      categories?: { title: string }[];
    }

    const pages = Object.values(data.query.pages) as ActionApiPage[];
    
    return pages.map((page) => {
      const pageTitleEncoded = encodeURIComponent(page.title);
      const extractHtml = page.extract || '';
      const extractText = extractHtml.replace(/<[^>]*>?/gm, ''); // simple html strip
      
      const categories = page.categories 
        ? page.categories.map((c) => c.title.replace(/^Category:/, ''))
        : [];

      return {
        id: page.pageid?.toString() || page.title,
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
  } catch (error) {
    console.error(`Error fetching related articles for ${title}:`, error);
    return [];
  }
}

export async function getWikipediaArticleFull(title: string): Promise<WikipediaArticle | null> {
  if (process.env.NEXT_PUBLIC_TEST_MODE === 'true') {
    return getWikipediaArticleSummary(title);
  }

  try {
    const summary = await getWikipediaArticleSummary(title);
    if (!summary) return null;

    const encodedTitle = encodeURIComponent(title);
    const res = await fetchWithRetry(`https://en.wikipedia.org/w/api.php?action=parse&page=${encodedTitle}&format=json&prop=text`, {
      headers: {
        'User-Agent': 'LoreApp/1.0 (Contact: admin@example.com)'
      },
      next: { revalidate: 3600 }
    });

    if (!res.ok) {
      return summary; // Return just the summary if full HTML fetch fails
    }

    const data = await res.json();
    if (data.parse && data.parse.text) {
      summary.html = data.parse.text['*'];
    }

    return summary;
  } catch (error) {
    console.error(`Error fetching full Wikipedia article ${title}:`, error);
    return null; // or just return the summary if we have it? Wait, we wouldn't have it here if we await it at the top, so we'd return null if it fails in try block.
  }
}
