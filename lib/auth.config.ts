import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

const authSecret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "dev-secret-change-me";
const googleEnabled = Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
const runtimeBaseUrl = process.env.NODE_ENV === "development"
  ? "http://127.0.0.1:3000"
  : (process.env.NEXTAUTH_URL || process.env.AUTH_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"));

if (!process.env.NEXTAUTH_URL) {
  process.env.NEXTAUTH_URL = runtimeBaseUrl;
}

if (!process.env.AUTH_URL) {
  process.env.AUTH_URL = runtimeBaseUrl;
}

// This config is edge-compatible - no database operations here
export const authConfig: NextAuthConfig = {
  providers: [
    ...(googleEnabled
      ? [
          Google({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            authorization: {
              params: {
                prompt: "consent",
                access_type: "offline",
                response_type: "code",
              },
            },
          }),
        ]
      : []),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      // The actual authorize function will be overridden in auth.ts
      authorize: async () => null,
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: authSecret,
  trustHost: true,
};
