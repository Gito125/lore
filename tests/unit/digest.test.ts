import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generateWeeklyDigest } from '@/lib/digest';
import { prisma } from '@/lib/db/prisma';

// Mock the prisma client
vi.mock('@/lib/db/prisma', () => ({
  prisma: {
    readingHistory: {
      findMany: vi.fn(),
    },
    interestGraph: {
      findMany: vi.fn(),
    },
    bookmark: {
      findMany: vi.fn(),
    },
  },
}));

describe('generateWeeklyDigest', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('aggregates reading history correctly', async () => {
    const mockUserId = 'user-123';
    
    // Mock 2 articles read, totaling 300 seconds
    vi.mocked(prisma.readingHistory.findMany).mockResolvedValue([
      { id: '1', userId: mockUserId, articleId: 'a1', title: 'A1', timeSpent: 100, readDepth: 1, createdAt: new Date() },
      { id: '2', userId: mockUserId, articleId: 'a2', title: 'A2', timeSpent: 200, readDepth: 1, createdAt: new Date() },
    ]);

    // Mock 1 top interest
    vi.mocked(prisma.interestGraph.findMany).mockResolvedValue([
      { id: '1', userId: mockUserId, topic: 'History', weight: 0.8, explicitlyFollowed: false, lastHit: new Date(), createdAt: new Date(), updatedAt: new Date() }
    ]);

    // Mock 0 bookmarks
    vi.mocked(prisma.bookmark.findMany).mockResolvedValue([]);

    const digest = await generateWeeklyDigest(mockUserId);

    expect(digest.totalArticlesRead).toBe(2);
    expect(digest.totalTimeSpent).toBe(300);
    expect(digest.topTopics).toEqual(['History']);
    expect(digest.bookmarkedArticles).toEqual([]);
    
    // Verify it passes the right date bounds
    expect(prisma.readingHistory.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          userId: mockUserId,
          createdAt: expect.objectContaining({
            gte: expect.any(Date),
            lte: expect.any(Date)
          })
        })
      })
    );
  });
});
