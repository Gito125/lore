import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db/prisma';
import { NextRequest } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ articleId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { articleId } = await params;

  try {
    const bookmark = await prisma.bookmark.findUnique({
      where: {
        userId_articleId: {
          userId: session.user.id,
          articleId: articleId
        }
      }
    });

    return Response.json({ isBookmarked: !!bookmark });
  } catch {
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ articleId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { articleId } = await params;

  try {
    await prisma.bookmark.delete({
      where: {
        userId_articleId: {
          userId: session.user.id,
          articleId: articleId
        }
      }
    });

    return Response.json({ success: true });
  } catch (error) {
    // Ignore error if it's already deleted (P2025)
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2025') {
      return Response.json({ success: true });
    }
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
