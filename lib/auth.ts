import type { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import { prisma } from "@/lib/prisma";

type GitHubProfile = {
  id: number;
  login: string;
  avatar_url: string;
};

export const authOptions: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID ?? "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET ?? "",
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, profile }) {
      if (profile) {
        const githubProfile = profile as unknown as GitHubProfile;
        const user = await prisma.user.upsert({
          where: { githubId: String(githubProfile.id) },
          update: {
            username: githubProfile.login,
            avatarUrl: githubProfile.avatar_url,
          },
          create: {
            githubId: String(githubProfile.id),
            username: githubProfile.login,
            avatarUrl: githubProfile.avatar_url,
          },
        });
        token.userId = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.userId) {
        session.user.id = token.userId as string;
      }
      return session;
    },
  },
};
