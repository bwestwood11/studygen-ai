import NextAuth, { DefaultSession } from "next-auth";
import authConfig from "@/auth.config";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma/prisma";
import { getUserById } from "./lib/user";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  callbacks: {
    async session({ session, token }) {

      return {
        ...session,
        user: {
          ...session.user,
          id: token.sub,
          isOAuth: token.isOauth,
        },
      };
     },
    async jwt({ token }) {
    
      if (!token.sub) return token;
      console.log("token", token)
      const existingUser = await getUserById(token.sub);

      if (!existingUser) return token;

      token.credits = existingUser.credits;
      token.name = existingUser.name;
      token.email = existingUser.email;
      token.image = existingUser.image;

      return token;
    },
  },
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  ...authConfig,
});
