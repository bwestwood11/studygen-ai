"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertTriangleIcon, ArrowLeft } from "lucide-react";
import { Button, buttonVariants } from "../ui/button";
import Link from "next/link";

const AuthErrorCard = () => {
  return (
    <Card className="max-w-[350px]">
      <CardHeader>
        <AlertTriangleIcon className="text-red-500 mx-auto" />
        <CardTitle className="text-center">
          Oops! Something went wrong
        </CardTitle>
        <CardDescription className="text-center">
          Please Try again later there is an internal error
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full flex justify-center items-center">
          <Link href={"/"} className={buttonVariants({ className: "gap-2" })}>
            <ArrowLeft /> Back
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default AuthErrorCard;
