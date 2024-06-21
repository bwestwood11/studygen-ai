"use client"

import { usePurchaseModal } from "@/components/modal/purchase-credits";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";


const DashboardPage = () => {
  const {openModal} = usePurchaseModal()
  const {data: session} = useSession()
  console.log(session)

  return (
    <div className="max-w-2xl mx-auto flex items-center justify-center">
       <Button onClick={()=>openModal()}>Purchase Credits</Button>
    </div>
  );
};

export default DashboardPage;
