import { InterestsClient } from '@/components/settings/InterestsClient';
import { getUserInterests } from './actions';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function InterestsSettingsPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/login');
  }

  const userInterests = await getUserInterests();

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-8 pb-20">
      <div>
        <h1 className="text-4xl md:text-5xl font-serif text-(--text-primary) tracking-tight mb-3">
          Manage Interests
        </h1>
        <p className="text-(--text-secondary) font-mono text-sm tracking-wide">
          CURATE YOUR FEED
        </p>
      </div>

      <InterestsClient initialInterests={userInterests} />
    </div>
  );
}
