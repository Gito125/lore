import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db/prisma';
import { z } from 'zod';

const settingsSchema = z.object({
  theme: z.string().optional(),
  serendipityLevel: z.coerce.number().min(1).max(100).optional(),
  notifications: z.boolean().optional()
});

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { theme: true, serendipityLevel: true, notifications: true }
    });

    return Response.json({ settings: user });
  } catch (error) {
    console.error('Failed to fetch settings:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = settingsSchema.safeParse(body);
    
    if (!parsed.success) {
      return Response.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const updated = await prisma.user.update({
      where: { id: session.user.id },
      data: parsed.data,
      select: { theme: true, serendipityLevel: true, notifications: true }
    });

    return Response.json({ settings: updated });
  } catch (error) {
    console.error('Failed to update settings:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
