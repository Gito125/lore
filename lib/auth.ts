import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/lib/db/prisma';
import GoogleProvider from 'next-auth/providers/google';
import { newId } from '@/lib/id';

const baseAdapter = PrismaAdapter(prisma);
const customAdapter = {
  ...baseAdapter,
  createUser: (data: Parameters<NonNullable<typeof baseAdapter.createUser>>[0]) => baseAdapter.createUser!({ ...data, id: newId() }),
  linkAccount: (data: Parameters<NonNullable<typeof baseAdapter.linkAccount>>[0]) => baseAdapter.linkAccount!({ ...data, id: newId() }),
  // @ts-expect-error Auth.js types don't include custom ID but our DB requires it
  createSession: (data: Parameters<NonNullable<typeof baseAdapter.createSession>>[0]) => baseAdapter.createSession!({ ...data, id: newId() }),
};

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: customAdapter,
  session: { strategy: 'database' },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || 'mock',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'mock',
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  pages: {
    signIn: '/login',
    newUser: '/onboarding',
  },
});
