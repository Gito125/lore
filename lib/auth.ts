import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/lib/db/prisma';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { newId } from '@/lib/id';

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' }, // Using JWT temporarily for mock Credentials auth
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || 'mock',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'mock',
    }),
    CredentialsProvider({
      name: 'Developer Login',
      credentials: {
        email: { label: "Email", type: "email" }
      },
      async authorize(credentials) {
        if (!credentials?.email) return null;
        const email = credentials.email as string;
        
        let user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
          user = await prisma.user.create({
            data: {
              id: newId(),
              email,
              name: email.split('@')[0],
            }
          });
        }
        return { id: user.id, email: user.email, name: user.name };
      }
    })
  ],
  pages: {
    signIn: '/login',
    newUser: '/onboarding',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});
