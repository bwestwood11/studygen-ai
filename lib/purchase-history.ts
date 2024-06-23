import "server-only";
import { auth } from "@/auth";
import { prisma } from "@/prisma/prisma";

export async function getPurchaseHistory() {
  const session = await auth();
  try {
    if (!session || !session.user || !session.user.id) return null;

    const purchaseHistory = await prisma.user.findFirst({
      where: {
        id: session?.user?.id,
      },
      select: {
        purchases: true,
      },
    });

    return purchaseHistory?.purchases || null;
  } catch (error) {
    console.error(error);
    return null;
  }
}
