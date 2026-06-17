import { SettingsClient } from '@/components/settings/SettingsClient';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db/prisma';
import { redirect } from 'next/navigation';

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/login');
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { theme: true, serendipityLevel: true, notifications: true }
  });

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-12">
      <div>
        <h1 className="text-4xl md:text-5xl font-serif text-(--text-primary) tracking-tight mb-3">
          Settings
        </h1>
        <p className="text-(--text-secondary) font-mono text-sm tracking-wide">
          PREFERENCES & ACCOUNT
        </p>
      </div>

      <SettingsClient initialSettings={user} />
    </div>
  );
}
