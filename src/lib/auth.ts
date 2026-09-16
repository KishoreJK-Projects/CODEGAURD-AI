import { AuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";

const providers: AuthOptions["providers"] = [];

const githubClientId = process.env.GITHUB_CLIENT_ID?.trim();
const githubClientSecret = process.env.GITHUB_CLIENT_SECRET?.trim();

if (githubClientId && githubClientSecret) {
  providers.push(
    GitHubProvider({
      clientId: githubClientId,
      clientSecret: githubClientSecret,
      authorization: {
        params: {
          scope: "read:user user:email repo",
        },
      },
    })
  );
}

// Quick Connect Provider for Instant Login without requiring OAuth App setup
providers.push(
  CredentialsProvider({
    id: "quick-connect",
    name: "GitHub Quick Connect",
    credentials: {
      username: { label: "GitHub Username", type: "text", placeholder: "kaisejan" },
      token: { label: "GitHub Token (Optional)", type: "password", placeholder: "ghp_..." },
    },
    async authorize(credentials) {
      const username = credentials?.username?.trim() || "kaisejan";
      const token = credentials?.token?.trim() || "";

      return {
        id: username,
        name: username,
        email: `${username}@github.user`,
        image: `https://github.com/${username}.png`,
        accessToken: token || `public_user_${username}`,
      };
    },
  })
);

export const authOptions: AuthOptions = {
  providers,

  callbacks: {
    async jwt({ token, account, user }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      if (user && "accessToken" in user) {
        token.accessToken = (user as { accessToken?: string }).accessToken;
      }

      return token;
    },

    async session({ session, token }) {
      session.accessToken = token.accessToken as string;

      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET || "codeguard_default_session_secret_2026",
};
