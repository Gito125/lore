import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const like = await prisma.like.findUnique({
      where: {
        userId_articleId: {
          userId: session.user.id,
          articleId: id
        }
      }
    });

    return Response.json({ isLiked: !!like });
  } catch {
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    await prisma.like.delete({
      where: {
        userId_articleId: {
          userId: session.user.id,
          articleId: id
        }
      }
    });
    
    // Also remove from interest graph if necessary, or just rely on the like
    return Response.json({ success: true });
  } catch (err) {
    console.error(err);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
