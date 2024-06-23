import { stripe } from "@/lib/stripe";
import { prisma } from "@/prisma/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    return new NextResponse("Invalid signature", { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  if (event.type === "checkout.session.completed") {
    const metadata = session.metadata;
    if (!metadata?.user || !metadata.creditsRequired || !session.amount_total) {
      return new NextResponse("Invalid metadata", { status: 400 });
    }
    try {
      await prisma.user.update({
        where: {
          email: metadata.user,
        },
        data: {
          credits: {
            increment: parseInt(metadata.creditsRequired),
          },
          purchases: {
            create: {
              quantity: parseInt(metadata.creditsRequired),
              price: session.amount_total / 100,
            },
          },
        },
      });
    } catch (error) {
      console.error("Error updating user", error);
      return new NextResponse("Error updating user", { status: 500 });
    }
  }

  return new NextResponse("Success", { status: 200 });
}
