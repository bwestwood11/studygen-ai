"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertTriangleIcon } from "lucide-react";

const AuthErrorCard = () => {
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle className="text-center">
          Oops! Something went wrong
        </CardTitle>
        <CardDescription className="text-center">
          Something Went Wrong While getting you authenticated
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full flex justify-center items-center">
          <AlertTriangleIcon className="text-red-500" />
        </div>
      </CardContent>
    </Card>
  );
};

export default AuthErrorCard;
