import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db/prisma';
import { NextRequest } from 'next/server';
import { newId } from '@/lib/id';

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { topic } = await request.json();
    if (!topic) return Response.json({ error: 'Topic required' }, { status: 400 });

    const userId = session.user.id;

    const existing = await prisma.interestGraph.findUnique({
      where: { userId_topic: { userId, topic } }
    });

    if (existing) {
      await prisma.interestGraph.update({
        where: { id: existing.id },
        data: {
          explicitlyFollowed: true,
          weight: Math.max(existing.weight, 0.6), // FOLLOW_FLOOR
          lastHit: new Date()
        }
      });
    } else {
      await prisma.interestGraph.create({
        data: {
          id: newId(),
          userId,
          topic,
          weight: 0.6, // FOLLOW_FLOOR
          explicitlyFollowed: true,
          lastHit: new Date()
        }
      });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error('Topic follow failed:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
