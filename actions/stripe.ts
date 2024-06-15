"use server";

import { getCurrentUser } from "./auth.action";
import { stripe } from "@/lib/stripe";

export async function stripeCheckout(creditsRequired: number) {
  try {
    const user = await getCurrentUser();
    console.log("user", user);
    if (!user || !user.email) {
      return {
        error: "You must be logged in to make a purchase",
      };
    }

    if (creditsRequired < 50 || creditsRequired > 20000) {
      return {
        error: "Invalid number of credits",
      };
    }

    const stripeSession = await stripe.checkout.sessions.create({
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL!}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL!}`,
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: user.email,
      metadata: {
        creditsRequired: creditsRequired,
        user: user.email,
      },
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID!,
          quantity: creditsRequired,
        },
   
      ],
    });
    console.log("stripe session url", stripeSession.url);
    if (!stripeSession.url)
      return {
        error: "An error occurred while processing your payment",
      };
    return { url: stripeSession.url };
  } catch (error) {
    console.log(error);
    return {
      error: "An error occurred while processing your payment",
    };
  }
}
