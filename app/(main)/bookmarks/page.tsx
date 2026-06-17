import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db/prisma';
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
    <main className="min-h-screen bg-(--bg-primary) py-12 px-4 md:px-0">
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
          <div className="text-center py-12 border border-dashed border-[rgba(255,255,255,0.1)] rounded-xl">
            <p className="text-(--text-muted) font-mono text-sm">No saved articles yet.</p>
          </div>
        ) : (
          bookmarks.map(bookmark => (
            <div key={bookmark.id} className="p-4 bg-(--bg-card) border border-(--border) rounded-xl hover:border-[rgba(255,255,255,0.12)] transition-colors flex justify-between items-start">
              <div className="flex flex-col">
                <Link href={`/article/${bookmark.articleId}`} className="text-lg font-serif text-(--text-primary) hover:text-(--accent) transition-colors">
                  {bookmark.title}
                </Link>
                {bookmark.summary && (
                  <p className="text-sm text-(--text-secondary) line-clamp-2 mt-1">{bookmark.summary}</p>
                )}
                <span className="text-xs text-(--text-muted) mt-3 font-mono">
                  Saved {formatDistanceToNow(bookmark.createdAt)} ago
                </span>
              </div>
              <div className="ml-4 flex-shrink-0">
                <BookmarkButton articleId={bookmark.articleId} title={bookmark.title} summary={bookmark.summary || undefined} />
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
