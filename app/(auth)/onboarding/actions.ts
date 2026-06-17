'use server';

import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db/prisma';
import { newId } from '@/lib/id';
import { redirect } from 'next/navigation';

export async function saveOnboardingTopics(topics: string[]) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('Not authenticated');
  }

  const userId = session.user.id;

  // Seed interest graph with initial weights
  const initialWeight = 0.8; // High initial weight for explicit selection

  for (const topic of topics) {
    await prisma.interestGraph.upsert({
      where: {
        userId_topic: {
          userId,
          topic
        }
      },
      update: {
        weight: initialWeight,
        lastHit: new Date()
      },
      create: {
        id: newId(),
        userId,
        topic,
        weight: initialWeight
      }
    });
  }

  redirect('/feed');
}
