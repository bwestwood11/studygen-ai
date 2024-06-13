"use server"

import { signIn } from "@/auth"

export const SocialLoginAction = async (provider:"google" | "github") => {
       
        await signIn(provider, { callbackUrl: "/" })
}
