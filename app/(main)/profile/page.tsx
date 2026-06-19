import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db/prisma';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import dynamic from 'next/dynamic';
const KnowledgeGraph = dynamic(
  () => import('@/components/profile/KnowledgeGraph').then(mod => mod.KnowledgeGraph),
  { ssr: false, loading: () => <div className="w-full h-96 animate-pulse bg-[rgba(255,255,255,0.02)] rounded-xl" /> }
);

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
    <div className="w-full">
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
            <div className="bg-[rgba(26,26,46,0.5)] backdrop-blur-xl border border-[rgba(255,255,255,0.06)] rounded-2xl p-6 flex flex-col items-center justify-center hover:border-[rgba(255,255,255,0.15)] transition-colors duration-300">
              <span className="text-4xl font-serif text-(--accent)">{historyAggregation._count.id || 0}</span>
              <span className="text-[10px] font-mono text-(--text-muted) uppercase tracking-widest mt-3">Articles Read</span>
            </div>
            <div className="bg-[rgba(26,26,46,0.5)] backdrop-blur-xl border border-[rgba(255,255,255,0.06)] rounded-2xl p-6 flex flex-col items-center justify-center hover:border-[rgba(255,255,255,0.15)] transition-colors duration-300">
              <span className="text-4xl font-serif text-(--accent)">{totalTimeSpentMinutes}</span>
              <span className="text-[10px] font-mono text-(--text-muted) uppercase tracking-widest mt-3">Minutes Spent</span>
            </div>
          </div>
        </section>

        {/* Top Topics / Knowledge Graph */}
        {topTopics.length > 0 && (
          <section>
            <h2 className="text-sm font-mono text-(--text-muted) tracking-widest uppercase mb-4">Knowledge Graph</h2>
            <div className="bg-[rgba(26,26,46,0.5)] backdrop-blur-xl border border-[rgba(255,255,255,0.06)] rounded-2xl p-6">
               <KnowledgeGraph topics={topTopics} />
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
              <div className="text-center py-12 bg-[rgba(26,26,46,0.3)] backdrop-blur-xl border border-dashed border-[rgba(255,255,255,0.1)] rounded-2xl">
                <p className="text-(--text-muted) font-mono text-sm">No reading history yet.</p>
              </div>
            ) : (
              history.map(item => (
                <div key={item.id} className="flex flex-col border-b border-[rgba(255,255,255,0.06)] pb-4 last:border-0 last:pb-0">
                  <Link href={`/article/${item.articleId}`} className="text-lg font-serif text-(--text-primary) hover:text-(--accent) transition-colors">
                    {item.title}
                  </Link>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-xs text-(--text-muted) font-mono uppercase tracking-widest">
                      {formatDistanceToNow(item.createdAt)} ago
                    </span>
                    <span className="text-[10px] text-(--text-muted) font-mono uppercase tracking-widest border-l border-[rgba(255,255,255,0.1)] pl-4">
                      {item.timeSpent}s spent
                    </span>
                    <span className="text-[10px] text-(--text-muted) font-mono uppercase tracking-widest border-l border-[rgba(255,255,255,0.1)] pl-4">
                      {Math.round(item.readDepth * 100)}% read
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

      </div>
    </div>
  );
}
