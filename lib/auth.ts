import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/lib/db/prisma';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
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
  trustHost: true,
  session: { strategy: process.env.NODE_ENV !== 'production' ? 'jwt' : 'database' },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    ...(process.env.NODE_ENV !== 'production' ? [
      CredentialsProvider({
        name: 'Test',
        credentials: {
          username: { label: "Username", type: "text" },
          password: { label: "Password", type: "password" }
        },
        async authorize() {
          const user = await prisma.user.findFirst({ where: { email: 'test@example.com' } });
          if (user) return user;
          
          return await prisma.user.create({
            data: {
              id: newId(),
              email: 'test@example.com',
              name: 'Test User'
            }
          });
        }
      })
    ] : [])
  ],
  pages: {
    signIn: '/login',
    newUser: '/onboarding',
    error: '/login',
  },
  callbacks: {
    session({ session, token, user }) {
      if (session.user) {
        session.user.id = user?.id || token?.sub || '';
      }
      return session;
    }
  },
});
