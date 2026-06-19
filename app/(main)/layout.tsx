import { Sidebar } from '@/components/navigation/Sidebar';
import { BottomNav } from '@/components/navigation/BottomNav';
import { HeroReveal } from '@/components/feed/HeroReveal';

export default function MainLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal?: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-(--bg-primary)">
      <HeroReveal />
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen max-w-full overflow-x-hidden pb-20 md:pb-0">
        <main className="flex-1 w-full p-4 md:p-8 lg:p-12">
          {children}
        </main>
      </div>
      {modal}
      <BottomNav />
    </div>
  );
}
