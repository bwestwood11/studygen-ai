import SocialAuthCard from "@/components/auth/social-auth-card";
import { Suspense } from "react";

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center w-full h-svh">
      <Suspense fallback={<div>Loading...</div>}>
      <SocialAuthCard />
      </Suspense>
    </div>
  );
}
