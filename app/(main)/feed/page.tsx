import { ArticleCard } from '@/components/feed/ArticleCard';
import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { FeedSkeleton } from '@/components/feed/FeedSkeleton';

// Mock function for now, will connect to API wrapper later
async function getFeedArticles() {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1500));
  return [
    {
      id: '1',
      title: 'Voynich manuscript',
      extract: 'The Voynich manuscript is an illustrated codex hand-written in an otherwise unknown writing system, referred to as "Voynichese". The vellum on which it is written has been carbon-dated to the early 15th century.',
      imageUrl: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=800&h=400',
      readTime: 6,
      category: 'History',
    },
    {
      id: '2',
      title: 'Dyatlov Pass incident',
      extract: 'The Dyatlov Pass incident was an event in which nine Soviet trekkers died under mysterious circumstances in the northern Ural Mountains between February 1 and 2, 1959.',
      imageUrl: 'https://images.unsplash.com/photo-1548674914-41d3e8e19c3b?auto=format&fit=crop&q=80&w=800&h=400',
      readTime: 8,
      category: 'Mystery',
    },
    {
      id: '3',
      title: 'Bronze Age collapse',
      extract: 'The Late Bronze Age collapse was a time of widespread societal collapse during the 12th century BC, when nearly every city in the eastern Mediterranean was destroyed.',
      imageUrl: 'https://images.unsplash.com/photo-1563820245084-307997a44f51?auto=format&fit=crop&q=80&w=800&h=400',
      readTime: 12,
      category: 'Archaeology',
    },
  ];
}

async function FeedContent() {
  const session = await auth();
  if (!session?.user) {
    redirect('/login');
  }
  const articles = await getFeedArticles();
  
  return (
    <div className="flex flex-col gap-6 w-full max-w-2xl mx-auto">
      {articles.map((article, i) => (
        <ArticleCard key={article.id} article={article} index={i} />
      ))}
    </div>
  );
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
