import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db/prisma';
import type { Bookmark } from '@prisma/client';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { BookmarkButton } from '@/components/feed/BookmarkButton';
import { formatDistanceToNow } from 'date-fns';

export default async function BookmarksPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/login');
  }

  const bookmarks = await prisma.bookmark.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="w-full">
      <div className="max-w-2xl mx-auto mb-12">
        <h1 className="text-4xl md:text-5xl font-serif text-(--text-primary) tracking-tight">
          Saved
        </h1>
        <p className="text-(--text-secondary) mt-3 font-mono text-sm tracking-wide">
          YOUR PERSONAL ARCHIVE
        </p>
      </div>

      <div className="max-w-2xl mx-auto flex flex-col gap-4">
        {bookmarks.length === 0 ? (
          <div className="text-center py-12 bg-[rgba(26,26,46,0.3)] backdrop-blur-xl border border-dashed border-[rgba(255,255,255,0.1)] rounded-2xl">
            <p className="text-(--text-muted) font-mono text-sm">No saved articles yet.</p>
          </div>
        ) : (
          bookmarks.map((bookmark: Bookmark) => (
            <div key={bookmark.id} className="p-6 bg-[rgba(26,26,46,0.5)] backdrop-blur-xl border border-[rgba(255,255,255,0.06)] rounded-2xl hover:border-[rgba(255,255,255,0.15)] transition-all duration-300 flex justify-between items-start group">
              <div className="flex flex-col pr-6">
                <Link href={`/article/${bookmark.articleId}`} className="text-xl md:text-2xl font-serif text-(--text-primary) leading-snug tracking-tight group-hover:text-(--accent) transition-colors duration-300">
                  {bookmark.title}
                </Link>
                {bookmark.summary && (
                  <p className="text-sm md:text-[15px] text-(--text-secondary) leading-relaxed mt-2 line-clamp-2">{bookmark.summary}</p>
                )}
                <span className="text-[10px] uppercase tracking-widest text-(--text-muted) mt-4 font-mono">
                  Saved {formatDistanceToNow(bookmark.createdAt)} ago
                </span>
              </div>
              <div className="flex-shrink-0 mt-1">
                <BookmarkButton articleId={bookmark.articleId} title={bookmark.title} summary={bookmark.summary || undefined} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
