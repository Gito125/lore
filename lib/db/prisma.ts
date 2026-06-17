import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

// We define the pool and adapter conditionally or unconditionally. 
// But in a serverless environment (Next.js), instantiating Pool globally is needed so it doesn't leak.
// Let's attach pool and adapter to globalForPrisma as well to prevent re-creation.

const pool = globalForPrisma.prisma ? undefined : new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = pool ? new PrismaPg(pool) : undefined;

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
