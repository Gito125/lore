import { useEffect, useRef, useCallback } from 'react';

interface EngagementOptions {
  articleId: string;
  title?: string;
  topics?: string[];
}

export function useEngagement({ articleId, title, topics }: EngagementOptions) {
  const startTime = useRef<number>(0);
  const maxScrollDepth = useRef<number>(0);
  const isEngaged = useRef<boolean>(false);

  const recordEngagement = useCallback(() => {
    if (isEngaged.current) return;
    
    const timeSpent = Math.round((Date.now() - startTime.current) / 1000); // seconds
    const depth = maxScrollDepth.current;
    
    let eventType = 'open';
    if (timeSpent < 3 && depth < 0.2) {
      eventType = 'skip';
    } else if (depth > 0.7) {
      eventType = 'scroll_complete';
    }

    fetch('/api/engage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        article_id: articleId,
        title,
        event_type: eventType,
        topics,
        metadata: {
          read_depth: depth,
          time_spent: timeSpent
        }
      })
    }).catch(err => console.error('Failed to record engagement', err));

    isEngaged.current = true;
  }, [articleId, title, topics]);

  useEffect(() => {
    startTime.current = Date.now();
    maxScrollDepth.current = 0;
    isEngaged.current = false;

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.body.scrollHeight;
      
      const depth = Math.min(1.0, (scrollPosition + windowHeight) / documentHeight);
      
      if (depth > maxScrollDepth.current) {
        maxScrollDepth.current = depth;
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      recordEngagement();
    };
  }, [articleId, recordEngagement]);


  // Expose a manual trigger if needed, e.g. for bookmarking
  const triggerEvent = useCallback((eventType: string, extraMetadata?: Record<string, unknown>) => {
    fetch('/api/engage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        article_id: articleId,
        title,
        event_type: eventType,
        topics,
        metadata: extraMetadata || {}
      })
    }).catch(err => console.error(`Failed to record ${eventType}`, err));
  }, [articleId, title, topics]);

  return { triggerEvent };
}
