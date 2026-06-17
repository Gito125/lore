import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BookmarkButton } from '@/components/feed/BookmarkButton';
import React from 'react';

// Mock fetch
global.fetch = vi.fn();

describe('BookmarkButton', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('renders loading state initially, then checks bookmark status', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ isBookmarked: true }),
    } as unknown as Response);

    render(<BookmarkButton articleId="123" title="Test" />);

    // Wait for loading to finish and fetch to be called
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/bookmarks/123');
    });

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Remove bookmark');
  });

  it('toggles bookmark status on click', async () => {
    // Initial fetch (not bookmarked)
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ isBookmarked: false }),
    } as unknown as Response);

    render(<BookmarkButton articleId="123" title="Test" />);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1);
    });

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Bookmark article');

    // Mock successful POST
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ bookmark: { id: 'b1' } }),
    } as unknown as Response);

    fireEvent.click(button);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(2);
      expect(fetch).toHaveBeenLastCalledWith('/api/bookmarks', expect.objectContaining({
        method: 'POST',
      }));
    });

    expect(button).toHaveAttribute('aria-label', 'Remove bookmark');
  });
});
