"use client";

import React from "react";
import { Button } from "../ui/button";
import { usePurchaseModal } from "./purchase-credits";
import { cn } from "@/lib/utils";

const PurchaseModalButton = ({
  children,
  onClick,
  className,
  ...props
}: React.ComponentPropsWithoutRef<"button">) => {
  const { openModal } = usePurchaseModal();

  return (
    <Button onClick={openModal} className={cn("gap-2", className)}>
      {children}
    </Button>
  );
};

export default PurchaseModalButton;
