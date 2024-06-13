"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "../ui/button";

import { FaGithub, FaGoogle } from "react-icons/fa";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { FormEvent } from "react";

const CardComponent = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  const handleOauth = (e: FormEvent<HTMLButtonElement>, provider: string) => {
    e.preventDefault();
    signIn(provider, {
      callbackUrl: callbackUrl || DEFAULT_LOGIN_REDIRECT,
    });
  };
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle className="text-center">Login</CardTitle>
        <CardDescription className="text-center">
          Increase Your Study Productivity 76%.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <Button onClick={(e) => handleOauth(e, "google")} className="gap-2">
              <FaGoogle />
              SignIn with Google{" "}
            </Button>
            <Button
              onClick={(e) => handleOauth(e, "github")}
              variant={"outline"}
              className="gap-2"
            >
              <FaGithub />
              SignIn with Github{" "}
            </Button>
          </div>
        </form>
        <CardFooter>
          <p className="text-foreground/30 text-xs text-center mt-4">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </CardFooter>
      </CardContent>
    </Card>
  );
};

export default CardComponent;
