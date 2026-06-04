// auth.config.ts
import type { NextAuthConfig} from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

export const authConfig: NextAuthConfig = {
  session: { strategy: "jwt" },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
    // Credentials ใส่แค่ definition ไม่มี bcrypt/prisma
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize() {
        return null; // logic จริงอยู่ใน auth.ts
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub as string;
        session.user.role = (token.role as "user") || "admin";
      }
      return session;
    },
  },
  pages: { signIn: "/login" },
};
