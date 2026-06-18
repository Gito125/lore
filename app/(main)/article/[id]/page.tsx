import { getWikipediaArticleFull } from '@/lib/wikipedia/api';
import { parseWikipediaContent } from '@/lib/wikipedia/parser';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import { WikipediaContent } from '@/components/article/WikipediaContent';

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
      if (data.originalimage) {
        thumbnailUrl = data.originalimage.source;
      } else if (data.thumbnail) {
        // Fallback to requesting a high-res thumbnail
        thumbnailUrl = data.thumbnail.source.replace(/\/\d+px-/, '/1200px-');
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
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
              priority
            />
          </div>
        )}
        
        <WikipediaContent htmlContent={htmlContent} />
      </article>
    </div>
  );
}
