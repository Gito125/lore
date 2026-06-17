import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/lib/db/prisma';
import GoogleProvider from 'next-auth/providers/google';
import { newId } from '@/lib/id';

const baseAdapter = PrismaAdapter(prisma);
const customAdapter = {
  ...baseAdapter,
  createUser: (data: any) => baseAdapter.createUser!({ ...data, id: newId() }),
  linkAccount: (data: any) => baseAdapter.linkAccount!({ ...data, id: newId() }),
  createSession: (data: any) => baseAdapter.createSession!({ ...data, id: newId() }),
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
