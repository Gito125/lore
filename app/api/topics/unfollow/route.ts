import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db/prisma';
import { NextRequest } from 'next/server';

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
          explicitlyFollowed: false,
          lastHit: new Date()
        }
      });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error('Topic unfollow failed:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
