import { ArticleCard } from '@/components/feed/ArticleCard';
import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { FeedSkeleton } from '@/components/feed/FeedSkeleton';

import { FeedList } from '@/components/feed/FeedList';
import { prisma } from '@/lib/db/prisma';
import { getRelatedArticles, type WikipediaArticle } from '@/lib/wikipedia/api';
import { rankArticles } from '@/lib/algorithm/scorer';
import { headers } from 'next/headers';

async function getInitialFeedArticles(userId: string) {
  const userInterests = await prisma.interestGraph.findMany({
    where: { userId },
    orderBy: { weight: 'desc' },
    take: 3
  });

  let topicsToFetch = userInterests.map(i => i.topic);
  if (topicsToFetch.length === 0) {
    topicsToFetch = ['Science', 'History', 'Technology'];
  }

  const currentTopic = topicsToFetch[0];
  const related = await getRelatedArticles(currentTopic);
  
  const context = {
    userInterests: userInterests.map(i => ({ topic: i.topic, weight: i.weight })),
    recentHistorySummaries: [], 
    sessionAvgReadTime: 180 
  };

  const scored = rankArticles(related, context);
  const recommendations = scored.slice(0, 10);
  
  return recommendations.map((article: WikipediaArticle) => ({
    id: article.id,
    title: article.title,
    extract: article.extract,
    imageUrl: article.thumbnail?.source,
    readTime: article.wordCount ? Math.max(1, Math.ceil(article.wordCount / 250)) : 5,
    category: article.categories?.[0] || 'Uncategorized',
  }));
}

async function FeedContent() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/login');
  }
  const initialArticles = await getInitialFeedArticles(session.user.id);
  
  return <FeedList initialArticles={initialArticles} />;
}

export default function FeedPage() {
  return (
    <div className="w-full">
      <div className="max-w-2xl mx-auto mb-12">
        <h1 className="text-4xl md:text-5xl font-serif text-(--text-primary) tracking-tight">
          Your Feed
        </h1>
        <p className="text-(--text-secondary) mt-3 font-mono text-sm tracking-wide">
          CURATED FOR YOU · {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase()}
        </p>
      </div>

      <Suspense fallback={<FeedSkeleton />}>
        <FeedContent />
      </Suspense>
    </div>
  );
}
