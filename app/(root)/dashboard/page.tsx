"use client"

import { usePurchaseModal } from "@/components/modal/purchase-credits";
import { Button } from "@/components/ui/button";


const DashboardPage = () => {
  const {openModal} = usePurchaseModal()

  return (
    <div className="max-w-2xl mx-auto flex items-center justify-center">
       <Button onClick={()=>openModal()}>Purchase Credits</Button>
    </div>
  );
};

export default DashboardPage;
