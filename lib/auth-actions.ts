"use server";

import bcrypt from "bcryptjs";
import { getLocale } from "next-intl/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { signIn, signOut } from "@/lib/auth";

export async function registerUser(_: unknown, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;



  if (!email || !password) {
    return { error: "Missing required fields"  };
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { error: "User already exists" };
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: "user",
      },
    });

    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
  } catch {
    return { error: "Registration failed" };
  }


  redirect("/");
}

export async function loginUser(_: unknown, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Missing required fields" };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
  } catch {
    return { error: "Invalid credentials" };
  }

  const locale = await getLocale();
  const callback = formData.get("callbackUrl");
  redirect(typeof callback === "string" && /^\/(th|en)\/checkout$/.test(callback) ? callback : `/${locale}`);
}

export async function loginWithGoogle() {
  await signIn("google", {
    redirectTo: "/",
  });
}

export async function signOutUser() {
  await signOut({
    redirectTo: "/",
  });
}
