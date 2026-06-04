import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { authConfig } from "@/auth.config";
import NextAuth from "next-auth";
const { auth } = NextAuth(authConfig);

export async function getCurrentUser() {
  const session = await auth();
  const userId = session?.user?.id ? Number(session.user.id) : null;
  if (!userId) {
    return null;
  }

  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
    },
  });
}

export async function requireAuth() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}

export async function requireAdmin() {
  const user = await requireAuth();
  if (user.role !== "admin") {
    redirect("/");
  }
  return user;
}
