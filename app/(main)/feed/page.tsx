import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { FeedSkeleton } from '@/components/feed/FeedSkeleton';

import { FeedList } from '@/components/feed/FeedList';
import { generateRandomFeed } from '@/lib/feed/generator';



async function FeedContent() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/login');
  }
  const initialArticles = await generateRandomFeed(session.user.id, 10);
  
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
