import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db/prisma';
import { newId } from '@/lib/id';
import { z } from 'zod';
import { NextRequest } from 'next/server';

const createLikeSchema = z.object({
  articleId: z.string().min(1),
  title: z.string().min(1)
});

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const likes = await prisma.like.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' }
    });
    return Response.json({ likes });
  } catch {
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
    const parsed = createLikeSchema.safeParse(body);
    
    if (!parsed.success) {
      return Response.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const like = await prisma.like.create({
      data: {
        id: newId(),
        userId: session.user.id,
        articleId: parsed.data.articleId,
        title: parsed.data.title
      }
    });

    return Response.json({ like });
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
      return Response.json({ error: 'Like already exists' }, { status: 409 });
    }
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
