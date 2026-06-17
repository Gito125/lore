import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db/prisma';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '50');

  try {
    const history = await prisma.readingHistory.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      take: limit
    });
    return Response.json({ history });
  } catch {
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE() {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await prisma.readingHistory.deleteMany({
      where: { userId: session.user.id }
    });
    return Response.json({ success: true });
  } catch {
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
