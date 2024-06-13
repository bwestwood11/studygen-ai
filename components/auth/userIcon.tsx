"use client";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserAvatar } from "@/components/ui/avatar";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { Heart, Library, LogOut, Upload } from "lucide-react";

const UserButton = ({
  username,
  profileImage,
  userEmail,
}: {
  username: string;
  profileImage: string;
  userEmail: string;
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserAvatar
          alt="Profile"
          name={username}
          width={40}
          height={40}
          size="size-10"
          src={profileImage}
          className=" size-10"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>{username}</DropdownMenuLabel>
        <p className="px-2 text-xs">{userEmail}</p>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link
            href={"/liked"}
            className="w-full h-full flex items-center gap-2"
          >
            <Heart size={15} />
            Liked
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link
            href={"/saved"}
            className="w-full h-full flex items-center gap-2"
          >
            <Library size={15} />
            Saved
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link href={"/me"} className="w-full h-full flex items-center gap-2">
            <Upload size={15} />
            My Images
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="flex items-center gap-2 cursor-pointer focus:bg-destructive hover:bg-destructive hover:text-destructive-foreground focus:text-destructive-foreground "
          onClick={() => signOut()}
          role="button"
        >
          <LogOut size={15} />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserButton;
