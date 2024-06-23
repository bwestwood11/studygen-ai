"use server";

import { auth } from "@/auth";
import { prisma } from "@/prisma/prisma";
import { Prisma, User } from "@prisma/client";
import { Session } from "next-auth";

/* This Action is used to get the current user's profile information. */
export async function getCurrentUser(): Promise<null | Session["user"]> {
    const session = await auth();
    if (session1 && session?.user) {
      return session.user;
    }
    return null;
}


type UserWithIncludes<T extends Prisma.UserInclude> = Prisma.UserGetPayload<{include:T}>;


/* This function is used to get the current user's profile from prisma */
export async function getDbCurrentUser<T extends Prisma.UserInclude>({includes}: {includes?: T}): Promise<UserWithIncludes<T> | null> {
 
    const session = await getCurrentUser();
    if (!session) {
      return null;
    }

    const user = await prisma.user.findFirst({
      where: {
        id: session.id,
      },
      include: includes,
    });
    if (!user) {
      return null;
    }

    // TODO - Remove this type assertion when Prisma types are fixed
    return user as UserWithIncludes<T>;
}
