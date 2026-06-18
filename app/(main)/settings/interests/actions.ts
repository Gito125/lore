'use server';

import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db/prisma';
import { newId } from '@/lib/id';

export async function getUserInterests() {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');
  
  const interests = await prisma.interestGraph.findMany({
    where: { userId: session.user.id }
  });
  
  return interests.map(i => i.topic);
}

export async function updateUserInterests(topics: string[]) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');
  
  const userId = session.user.id;
  
  // Start a transaction: delete old, insert new
  await prisma.$transaction(async (tx) => {
    // Delete all explicitly followed topics (we can just delete all and re-insert, or delete missing ones)
    // Actually, to preserve weight/lastHit of existing topics, we should:
    // 1. Delete ones not in the new array
    await tx.interestGraph.deleteMany({
      where: {
        userId,
        topic: { notIn: topics }
      }
    });
    
    // 2. Upsert the new ones
    for (const topic of topics) {
      await tx.interestGraph.upsert({
        where: { userId_topic: { userId, topic } },
        update: { explicitlyFollowed: true },
        create: {
          id: newId(),
          userId,
          topic,
          weight: 0.8,
          explicitlyFollowed: true
        }
      });
    }
  });

  return { success: true };
}
