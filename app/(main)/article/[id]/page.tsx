import { getWikipediaArticleSummary } from '@/lib/wikipedia/api';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  // For the mock IDs (1, 2, 3), we'll just show a placeholder
  // If it's a real wikipedia article, we can fetch it
  let articleTitle = 'Article Details';
  let content = 'This is a placeholder for article ' + id;
  
  // Try to fetch real article if ID looks like a string rather than just "1"
  if (id.length > 3) {
    const data = await getWikipediaArticleSummary(decodeURIComponent(id));
    if (data) {
      articleTitle = data.title;
      content = data.extract;
    }
  }

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col gap-8">
      <Link href="/feed" className="flex items-center gap-2 text-sm font-mono text-(--text-muted) hover:text-(--text-primary) transition-colors w-fit">
        <ArrowLeft className="w-4 h-4" />
        Back to Feed
      </Link>
      
      <article className="prose prose-invert prose-lg max-w-none">
        <h1 className="text-4xl md:text-6xl font-serif text-(--text-primary) tracking-tight mb-8">
          {articleTitle}
        </h1>
        
        <div className="text-(--text-secondary) leading-relaxed">
          {content}
        </div>
      </article>
      
      <div className="mt-12 p-6 bg-[rgba(26,26,46,0.3)] backdrop-blur-xl border border-dashed border-[rgba(255,255,255,0.1)] rounded-2xl">
        <p className="text-sm font-mono text-(--text-muted) text-center">
          Note: Full article rendering and Wikipedia data wiring is tracked in Phase 5.
        </p>
      </div>
    </div>
  );
}
