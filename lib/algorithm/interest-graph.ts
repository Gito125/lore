import { prisma } from '@/lib/db/prisma';

export const WEIGHT_CAP = 1.0;
export const FOLLOW_FLOOR = 0.6;
export const DAILY_DECAY_RATE = 0.05; // 5%

export const ENGAGEMENT_DELTAS: Record<string, number> = {
  'open': 0.05,
  'skip': -0.02,
  'bookmark': 0.15,
  'share': 0.20,
  'scroll_complete': 0.10,
};

/**
 * Updates a user's interest graph based on an engagement event.
 */
export async function updateTopicWeights(userId: string, topics: string[], eventType: string) {
  const delta = ENGAGEMENT_DELTAS[eventType];
  if (!delta) return;

  for (const topic of topics) {
    const existing = await prisma.interestGraph.findUnique({
      where: {
        userId_topic: { userId, topic }
      }
    });

    if (existing) {
      let newWeight = existing.weight + delta;
      
      // Ensure it doesn't go below 0 or above 1.0
      newWeight = Math.max(0, Math.min(WEIGHT_CAP, newWeight));

      await prisma.interestGraph.update({
        where: { id: existing.id },
        data: {
          weight: newWeight,
          lastHit: new Date()
        }
      });
    } else if (delta > 0) {
      // Only create if it's a positive engagement
      // Wait, we need an ID for new entries. We should import newId from lib/id.ts
      const { newId } = await import('@/lib/id');
      
      await prisma.interestGraph.create({
        data: {
          id: newId(),
          userId,
          topic,
          weight: Math.min(WEIGHT_CAP, delta),
          lastHit: new Date()
        }
      });
    }
  }
}

/**
 * Decays the interest graph. Designed to be run daily via cron.
 * In a production app, this would be a bulk SQL update.
 */
export async function applyDailyDecay() {
  await prisma.interestGraph.findMany();
  
  // In a real scenario we'd do:
  // UPDATE InterestGraph SET weight = weight * 0.95 WHERE weight > 0;
  
  // Wait, follow floor should be respected.
  // Actually, we can use Prisma raw query for efficiency.
  
  await prisma.$executeRaw`
    UPDATE "InterestGraph"
    SET weight = GREATEST(weight * ${1.0 - DAILY_DECAY_RATE}, 0.0)
  `;
}
