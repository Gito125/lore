import { getFullArticle } from '@/lib/services/article-service';
import { parseWikipediaContent } from '@/lib/wikipedia/parser';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import { WikipediaContent } from '@/components/article/WikipediaContent';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const data = await getFullArticle(decodeURIComponent(id));
  
  if (!data) {
    return { title: 'Article Not Found | Lore' };
  }

  return {
    title: `${data.title} | Lore`,
    description: data.extract?.substring(0, 160) || 'Read this article on Lore.',
    openGraph: {
      title: data.title,
      description: data.extract?.substring(0, 160),
      images: data.thumbnail ? [data.thumbnail.source] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: data.title,
      description: data.extract?.substring(0, 160),
      images: data.thumbnail ? [data.thumbnail.source] : [],
    }
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  const data = await getFullArticle(decodeURIComponent(id));
  
  if (!data) {
    return (
      <div className="w-full max-w-4xl mx-auto flex flex-col gap-8 pb-20">
        <Link href="/feed" className="flex items-center gap-2 text-sm font-mono text-(--text-muted) hover:text-(--text-primary) transition-colors w-fit">
          <ArrowLeft className="w-4 h-4" />
          Back to Feed
        </Link>
        <div className="text-center py-20 text-(--text-muted)">
          Article not found.
        </div>
      </div>
    );
  }

  const articleTitle = data.title;
  const htmlContent = data.html ? parseWikipediaContent(data.html) : data.extract_html;
  let thumbnailUrl: string | undefined;
  
  if (data.originalimage) {
    thumbnailUrl = data.originalimage.source;
  } else if (data.thumbnail) {
    // Fallback to requesting a high-res thumbnail
    thumbnailUrl = data.thumbnail.source.replace(/\/\d+px-/, '/1200px-');
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

