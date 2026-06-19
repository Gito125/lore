import { describe, it, expect, vi } from 'vitest';
import { getArticle, getRecommendations } from '@/lib/services/article-service';

// Mock fetch globally
global.fetch = vi.fn();

describe('article-service', () => {
  it('fetches an article summary successfully', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({
        title: 'Earth',
        extract: 'Earth is the third planet from the Sun.',
        extract_html: '<p>Earth is the third planet from the Sun.</p>',
        thumbnail: { source: 'http://example.com/earth.jpg', width: 300, height: 300 }
      })
    });

    const article = await getArticle('Earth');
    expect(article).toBeDefined();
    expect(article?.title).toBe('Earth');
    expect(article?.extract).toContain('Earth is the third planet');
  });

  it('fetches recommendations successfully', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({
        query: {
          pages: {
            "1": {
              pageid: 1,
              title: 'Moon',
              extract: 'The Moon is Earths only natural satellite.',
              categories: [{ title: 'Category:Satellites' }]
            }
          }
        }
      })
    });

    const recommendations = await getRecommendations('Earth');
    expect(recommendations).toHaveLength(1);
    expect(recommendations[0].title).toBe('Moon');
    expect(recommendations[0].categories).toContain('Satellites');
  });
});
