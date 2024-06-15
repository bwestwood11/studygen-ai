"use server";

import { auth } from "@/auth";
import { prisma } from "@/prisma/prisma";
import { User } from "@prisma/client";
import { Session } from "next-auth";

/* This Action is used to get the current user's profile information. */
export async function getCurrentUser(): Promise<null | Session["user"]> {
  try {
    const session = await auth();
    if (session && session?.user) {
      return session.user;
    }
    return null;
  } catch (error) {
    console.log(error);
    return null;
  }
}

/* This function is used to get the current user's profile from prisma */
export async function getDbCurrentUser(): Promise<null | User> {
  try {
    const session = await getCurrentUser();
    if (!session) {
      return null;
    }

    const user = await prisma.user.findFirst({
      where: {
        id: session.id,
      },
    });
    if (!user) {
      return null;
    }

    return user;
  } catch (error) {
    console.log(error);
    return null;
  }
}
