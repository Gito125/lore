import { getFullArticle } from '@/lib/services/article-service';
import { parseWikipediaContent } from '@/lib/wikipedia/parser';
import Image from 'next/image';
import { WikipediaContent } from '@/components/article/WikipediaContent';
import { ArticleModal } from '@/components/article/ArticleModal';

export default async function InterceptedArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  const data = await getFullArticle(decodeURIComponent(id));
  
  if (!data) {
    return (
      <ArticleModal articleId={id}>
        <div className="text-center py-20 text-(--text-muted)">
          Article not found.
        </div>
      </ArticleModal>
    );
  }

  const articleTitle = data.title;
  const htmlContent = data.html ? parseWikipediaContent(data.html) : data.extract_html;
  let thumbnailUrl: string | undefined;
  
  if (data.originalimage) {
    thumbnailUrl = data.originalimage.source;
  } else if (data.thumbnail) {
    thumbnailUrl = data.thumbnail.source.replace(/\/\d+px-/, '/1200px-');
  }

  return (
    <ArticleModal articleId={id}>
      <article className="prose prose-invert prose-lg max-w-none">
        <h1 className="text-4xl md:text-5xl font-serif text-(--text-primary) tracking-tight mb-8 pr-12">
          {articleTitle}
        </h1>
        
        {thumbnailUrl && (
          <div className="relative w-full h-64 md:h-80 mb-8 rounded-2xl overflow-hidden border border-(--border)">
            <Image 
              src={thumbnailUrl} 
              alt={articleTitle} 
              fill 
              sizes="(max-width: 1200px) 100vw, 1200px"
              className="object-cover"
              priority
            />
          </div>
        )}
        
        <WikipediaContent htmlContent={htmlContent} />
      </article>
    </ArticleModal>
  );
}
