import { prisma } from '@/lib/db/prisma';
import { newId } from '@/lib/id';

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

function normalizeTopic(topic: string): string {
  const t = topic.trim();
  const lower = t.toLowerCase();
  
  if (lower === 'neural networks' || lower === 'deep learning' || lower === 'transformers' || lower === 'machine learning') {
    return 'Artificial Intelligence';
  }
  
  // Basic title casing
  return t.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase());
}

/**
 * Updates a user's interest graph based on an engagement event.
 */
export async function updateTopicWeights(
  userId: string, 
  topics: string[], 
  eventType: string,
  metadata?: { read_depth?: number, time_spent?: number }
) {
  const baseDelta = ENGAGEMENT_DELTAS[eventType];
  if (!baseDelta) return;

  let completionFactor = 1.0;
  let timeFactor = 1.0;

  if (eventType === 'scroll_complete' || eventType === 'open') {
    if (metadata?.read_depth !== undefined) {
      completionFactor = Math.max(0.1, metadata.read_depth);
    }
    if (metadata?.time_spent !== undefined) {
      // Scale: 5 minutes (300s) = 1.0
      timeFactor = Math.max(0.01, Math.min(1.0, metadata.time_spent / 300));
    }
  }

  const delta = baseDelta * completionFactor * timeFactor;
  if (delta === 0) return;

  const normalizedTopics = Array.from(new Set(topics.map(normalizeTopic)));
  const now = new Date();

  const existingRecords = await prisma.interestGraph.findMany({
    where: {
      userId,
      topic: { in: normalizedTopics }
    }
  });

  const existingMap = new Map(existingRecords.map(r => [r.topic, r]));

  const operations = normalizedTopics.map(topic => {
    const existing = existingMap.get(topic);
    if (existing) {
      let newWeight = existing.weight + delta;
      newWeight = Math.max(0, Math.min(WEIGHT_CAP, newWeight));
      return prisma.interestGraph.update({
        where: { id: existing.id },
        data: { weight: newWeight, lastHit: now }
      });
    } else if (delta > 0) {
      return prisma.interestGraph.create({
        data: {
          id: newId(),
          userId,
          topic,
          weight: Math.min(WEIGHT_CAP, delta),
          lastHit: now
        }
      });
    }
    return null;
  }).filter(op => op !== null);

  if (operations.length > 0) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await prisma.$transaction(operations as any);
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
    SET weight = CASE 
      WHEN "explicitlyFollowed" = true THEN GREATEST(weight * ${1.0 - DAILY_DECAY_RATE}, ${FOLLOW_FLOOR})
      ELSE GREATEST(weight * ${1.0 - DAILY_DECAY_RATE}, 0.0)
    END
  `;
}
