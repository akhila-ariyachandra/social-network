import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import prisma from "@/prisma";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

const PROVIDER_TIMEOUT = 30000;

const nextAuth = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      httpOptions: {
        timeout: PROVIDER_TIMEOUT,
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      httpOptions: {
        timeout: PROVIDER_TIMEOUT,
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
});

export default nextAuth;
