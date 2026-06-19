import { prisma } from '@/lib/db/prisma';

export async function GET() {
  try {
    // Ping the database
    await prisma.$queryRaw`SELECT 1`;

    return Response.json(
      { status: 'ok', timestamp: new Date().toISOString() },
      { status: 200 }
    );
  } catch (error) {
    console.error('Health check failed:', error);
    return Response.json(
      { status: 'error', message: 'Database connection failed' },
      { status: 503 }
    );
  }
}
