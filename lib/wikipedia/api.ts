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
}

export async function getWikipediaArticleSummary(title: string): Promise<WikipediaArticle | null> {
  try {
    const encodedTitle = encodeURIComponent(title);
    const res = await fetch(`${WIKI_API_BASE}/summary/${encodedTitle}`, {
      headers: {
        'Api-User-Agent': 'LoreApp/1.0 (Contact: admin@example.com)'
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
  try {
    const encodedTitle = encodeURIComponent(title);
    const res = await fetch(`${WIKI_API_BASE}/related/${encodedTitle}`, {
      headers: {
        'Api-User-Agent': 'LoreApp/1.0 (Contact: admin@example.com)'
      },
      next: { revalidate: 3600 }
    } as RequestInit);

    if (!res.ok) {
      return [];
    }

    const data = await res.json();
    return (data.pages || []).map((page: Record<string, unknown>) => ({
      id: (page.pageid as number)?.toString() || (page.title as string),
      title: page.title,
      extract: page.extract,
      extract_html: page.extract_html,
      thumbnail: page.thumbnail,
      content_urls: page.content_urls,
    }));
  } catch (error) {
    console.error(`Error fetching related articles for ${title}:`, error);
    return [];
  }
}
