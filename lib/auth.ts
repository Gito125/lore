import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/lib/db/prisma';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { newId } from '@/lib/id';

const baseAdapter = PrismaAdapter(prisma);
const customAdapter = {
  ...baseAdapter,
  createUser: async (data: Parameters<NonNullable<typeof baseAdapter.createUser>>[0]) => {
    const { id, ...rest } = data as any;
    return await prisma.user.create({
      data: {
        ...rest,
        id: newId(),
      },
    }) as any;
  },
  linkAccount: async (data: Parameters<NonNullable<typeof baseAdapter.linkAccount>>[0]) => {
    const { id, ...rest } = data as any;
    return await prisma.account.create({
      data: {
        ...rest,
        id: newId(),
      },
    }) as any;
  },
  createSession: async (data: Parameters<NonNullable<typeof baseAdapter.createSession>>[0]) => {
    const { id, ...rest } = data as any;
    return await prisma.session.create({
      data: {
        ...rest,
        id: newId(),
      },
    }) as any;
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: customAdapter,
  trustHost: true,
  session: { strategy: 'database' },
  providers: [
    GoogleProvider({
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
  events: {
    async signIn({ user }) {
      if (user?.id) {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            loginCount: { increment: 1 },
            lastLoginAt: new Date(),
          },
        });
      }
    },
  },
});
