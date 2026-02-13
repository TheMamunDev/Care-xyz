import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { AuthOptions } from 'next-auth';

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {},
      async authorize(credentials: any) {
        const { email, password } = credentials;

        try {
          await connectDB();
          const user = await User.findOne({ email });
          if (!user) {
            return null;
          }
          const passwordsMatch = await bcrypt.compare(password, user.password);
          if (!passwordsMatch) {
            return null;
          }
          return {
            id: user._id.toString(),
            name: user.fullName,
            email: user.email,
            role: user.role,
            authType: 'credentials',
          };
        } catch (error) {
          console.log('Error: ', error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/login',
  },
  callbacks: {
    // Add user role to the token and session
    async jwt({ token, user, account }: any) {
      if (user) {
        if (account?.provider === 'google') {
          try {
            await connectDB();
            let dbUser = await User.findOne({ email: user.email });
            if (!dbUser) {
              dbUser = await User.create({
                fullName: user.name,
                email: user.email,
                image: user.image || user.picture || null,
                authType: 'google',
              });
            }
            token.role = dbUser.role;
            token.id = dbUser._id.toString();
          } catch (error) {
            console.log(error);
          }
        } else {
          token.role = user.role;
          token.id = user.id;
        }
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session.user) {
        session.user.role = token.role;
        session.user.id = token.id;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
