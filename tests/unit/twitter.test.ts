import { describe, it, expect } from 'vitest';
import { generateTwitterIntent } from '@/lib/sharing/twitter';

describe('generateTwitterIntent', () => {
  it('constructs a valid Twitter intent URL with summary', () => {
    const title = 'Dyatlov Pass incident';
    const summary = 'The Dyatlov Pass incident was an event. Nine hikers died. It remains a mystery.';
    const url = 'https://lore.test/article/123';

    const intentUrl = generateTwitterIntent(title, summary, url);
    const parsedUrl = new URL(intentUrl);

    expect(parsedUrl.origin).toBe('https://twitter.com');
    expect(parsedUrl.pathname).toBe('/intent/tweet');
    expect(parsedUrl.searchParams.get('url')).toBe(url);

    const text = parsedUrl.searchParams.get('text');
    expect(text).toContain('Reading about: Dyatlov Pass incident');
    expect(text).toContain('The Dyatlov Pass incident was an event.');
    expect(text).toContain('Read more on Lore.');
  });

  it('handles empty summaries gracefully', () => {
    const title = 'Empty Article';
    const summary = '';
    const url = 'https://lore.test/article/456';

    const intentUrl = generateTwitterIntent(title, summary, url);
    const text = new URL(intentUrl).searchParams.get('text');

    expect(text).toContain('Reading about: Empty Article');
    expect(text).toContain('Read more on Lore.');
  });
});
