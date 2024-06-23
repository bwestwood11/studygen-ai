"use client";

import { useSession } from "next-auth/react";
import UserButton from "@/components/auth/userIcon";
import { Button } from "@/components/ui/button";

const UserNavbar = () => {
  const { data: session, status } = useSession();
  return (
    <div>
      {status !== "authenticated" ? (
        <Button>Get Started</Button>
      ) : (
        <UserButton
          profileImage={session?.user?.image || undefined}
          userEmail={session?.user?.email || undefined}
          username={session?.user?.name || undefined}
        />
      )}
    </div>
  );
};

export default UserNavbar;
