import { auth } from '@/lib/auth';
import { NextRequest } from 'next/server';
import { generateWeeklyDigest } from '@/lib/digest';

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const digest = await generateWeeklyDigest(session.user.id);
    return Response.json({ digest });
  } catch (error) {
    console.error('Failed to generate weekly digest:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
