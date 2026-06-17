import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db/prisma';
import { newId } from '@/lib/id';
import { z } from 'zod';
import { NextRequest } from 'next/server';

const createBookmarkSchema = z.object({
  articleId: z.string().min(1),
  title: z.string().min(1),
  summary: z.string().optional()
});

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const bookmarks = await prisma.bookmark.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' }
    });
    return Response.json({ bookmarks });
  } catch (error) {
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = createBookmarkSchema.safeParse(body);
    
    if (!parsed.success) {
      return Response.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const bookmark = await prisma.bookmark.create({
      data: {
        id: newId(),
        userId: session.user.id,
        articleId: parsed.data.articleId,
        title: parsed.data.title,
        summary: parsed.data.summary
      }
    });

    return Response.json({ bookmark });
  } catch (error) {
    // Check if it's a unique constraint violation
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
      return Response.json({ error: 'Bookmark already exists' }, { status: 409 });
    }
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
