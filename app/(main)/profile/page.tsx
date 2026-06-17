import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db/prisma';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/login');
  }

  const userId = session.user.id;

  const [history, historyAggregation, topTopics] = await Promise.all([
    prisma.readingHistory.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 20
    }),
    prisma.readingHistory.aggregate({
      where: { userId },
      _sum: { timeSpent: true },
      _count: { id: true }
    }),
    prisma.interestGraph.findMany({
      where: { userId },
      orderBy: { weight: 'desc' },
      take: 5
    })
  ]);

  const totalTimeSpentMinutes = Math.floor((historyAggregation._sum.timeSpent || 0) / 60);

  return (
    <main className="min-h-screen bg-(--bg-primary) py-12 px-4 md:px-0">
      <div className="max-w-2xl mx-auto mb-12">
        <h1 className="text-4xl md:text-5xl font-serif text-(--text-primary) tracking-tight">
          Your Profile
        </h1>
        <p className="text-(--text-secondary) mt-3 font-mono text-sm tracking-wide uppercase">
          {session.user.name || session.user.email}
        </p>
      </div>

      <div className="max-w-2xl mx-auto flex flex-col gap-12">
        
        {/* Knowledge Stats */}
        <section>
          <h2 className="text-sm font-mono text-(--text-muted) tracking-widest uppercase mb-4">Knowledge Stats</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-(--bg-card) border border-(--border) rounded-xl p-4 flex flex-col items-center justify-center">
              <span className="text-3xl font-serif text-(--accent)">{historyAggregation._count.id || 0}</span>
              <span className="text-xs font-mono text-(--text-muted) uppercase mt-2">Articles Read</span>
            </div>
            <div className="bg-(--bg-card) border border-(--border) rounded-xl p-4 flex flex-col items-center justify-center">
              <span className="text-3xl font-serif text-(--accent)">{totalTimeSpentMinutes}</span>
              <span className="text-xs font-mono text-(--text-muted) uppercase mt-2">Minutes Spent</span>
            </div>
          </div>
        </section>

        {/* Top Topics */}
        {topTopics.length > 0 && (
          <section>
            <h2 className="text-sm font-mono text-(--text-muted) tracking-widest uppercase mb-4">Top Interests</h2>
            <div className="flex flex-wrap gap-2">
              {topTopics.map(topic => (
                <span key={topic.id} className="bg-[rgba(255,255,255,0.04)] text-(--text-secondary) px-3 py-1.5 rounded-full text-sm font-medium border border-(--border)">
                  {topic.topic}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Reading History */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-mono text-(--text-muted) tracking-widest uppercase">Reading History</h2>
            <button className="text-xs font-mono text-(--accent) hover:text-(--accent-hover) transition-colors">
              Clear History
            </button>
          </div>
          
          <div className="flex flex-col gap-4">
            {history.length === 0 ? (
              <div className="text-center py-8 border border-dashed border-[rgba(255,255,255,0.1)] rounded-xl">
                <p className="text-(--text-muted) font-mono text-sm">No reading history yet.</p>
              </div>
            ) : (
              history.map(item => (
                <div key={item.id} className="flex flex-col border-b border-(--border) pb-4 last:border-0 last:pb-0">
                  <Link href={`/article/${item.articleId}`} className="text-base font-serif text-(--text-primary) hover:text-(--accent) transition-colors">
                    {item.title}
                  </Link>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-(--text-muted) font-mono">
                      {formatDistanceToNow(item.createdAt)} ago
                    </span>
                    <span className="text-xs text-(--text-muted) font-mono">
                      {item.timeSpent}s spent
                    </span>
                    <span className="text-xs text-(--text-muted) font-mono">
                      {Math.round(item.readDepth * 100)}% read
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

      </div>
    </main>
  );
}
