"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Slider } from "../ui/slider"
import React from "react";
import { stripeCheckout } from "@/actions/stripe";
import { STRIPE_CONFIG } from "@/lib/config";
import { Button } from "../ui/button";
import { create } from 'zustand'
import { Label } from "../ui/label";

interface IPurchaseModal {
  isOpen: boolean
  setIsOpen: (val:boolean) => void
  openModal: () => void
}

export const usePurchaseModal = create<IPurchaseModal>()((set) => ({
  isOpen:false,
  setIsOpen:(val) => set((state) => ({isOpen:val})),
  openModal: () => set((state) => ({isOpen:true})), 
}))


const PurchaseCreditsModal = () => {
    const [credits, setCredits] = React.useState(STRIPE_CONFIG.MINIMUM_CREDITS);
    const [error, setError] = React.useState("");
    const {isOpen, setIsOpen} = usePurchaseModal()

    const purchaseCredits = async () => {
        if (credits < STRIPE_CONFIG.MINIMUM_CREDITS || credits > STRIPE_CONFIG.MAXIMUM_CREDITS || credits % STRIPE_CONFIG.CREDITS_STEP !== 0) {
          setError("Invalid number of credits");
          return;
        }
        const response = await stripeCheckout(credits);
        console.log(response)
        if (response.error || !response.url) {
          setError(
            response.error || "An error occurred while processing your payment"
          );
          return;
        }
        window.location.href = response.url
      };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
    <DialogContent>
    <DialogHeader>
      <DialogTitle>Purchase Credits</DialogTitle>
      <DialogDescription>Select the number of credits you would like to purchase.</DialogDescription>
      </DialogHeader>
        <div className="flex flex-col gap-6">
          <Label>Quantity of Credits</Label>
            <Slider value={[credits]} onValueChange={(v)=> setCredits(v[0])} max={STRIPE_CONFIG.MAXIMUM_CREDITS} step={STRIPE_CONFIG.CREDITS_STEP} />
        <Button onClick={() => purchaseCredits()}>Purchase {credits} Credits</Button>       
            <p className="text-center text-lg flex w-full justify-between">Total Cost:<span> ${credits / 2 * 0.05}</span></p> 
        {error && <p>{error}</p>}  
        </div>
      
   
  </DialogContent>
</Dialog>
  )
}

export default PurchaseCreditsModal