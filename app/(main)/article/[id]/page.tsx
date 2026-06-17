import { getWikipediaArticleFull } from '@/lib/wikipedia/api';
import { parseWikipediaContent } from '@/lib/wikipedia/parser';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  let articleTitle = 'Article Details';
  let htmlContent = '<p>This is a placeholder for article ' + id + '</p>';
  let thumbnailUrl: string | undefined;
  
  if (id.length > 3) {
    const data = await getWikipediaArticleFull(decodeURIComponent(id));
    if (data) {
      articleTitle = data.title;
      htmlContent = data.html ? parseWikipediaContent(data.html) : data.extract_html;
      if (data.thumbnail) {
        thumbnailUrl = data.thumbnail.source;
      }
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-8 pb-20">
      <Link href="/feed" className="flex items-center gap-2 text-sm font-mono text-(--text-muted) hover:text-(--text-primary) transition-colors w-fit">
        <ArrowLeft className="w-4 h-4" />
        Back to Feed
      </Link>
      
      <article className="prose prose-invert prose-lg max-w-none">
        <h1 className="text-4xl md:text-6xl font-serif text-(--text-primary) tracking-tight mb-8">
          {articleTitle}
        </h1>
        
        {thumbnailUrl && (
          <div className="relative w-full h-64 md:h-96 mb-8 rounded-2xl overflow-hidden border border-(--border)">
            <Image 
              src={thumbnailUrl} 
              alt={articleTitle} 
              fill 
              className="object-cover"
              priority
            />
          </div>
        )}
        
        <div 
          className="text-(--text-secondary) leading-relaxed wikipedia-content"
          dangerouslySetInnerHTML={{ __html: htmlContent }} 
        />
      </article>
    </div>
  );
}
