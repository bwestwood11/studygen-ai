"use client";

import Link from "next/link";
import Image from "next/image";
import { Montserrat } from "next/font/google";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Volume2Icon,
  Activity,
  Settings,
  Volume1Icon,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PiHouse } from "react-icons/pi";
import { FiLink } from "react-icons/fi";
import { Separator } from "@/components/ui/separator";
import { SlGlobe } from "react-icons/sl";
import { BsChatRightText } from "react-icons/bs";
import { MdModeEdit } from "react-icons/md";
import { FaRobot } from "react-icons/fa";

import { AiOutlineDeploymentUnit } from "react-icons/ai";
import { MdDownload } from "react-icons/md";
import { MdOutlineQuestionAnswer } from "react-icons/md";
import { BsChatDots } from "react-icons/bs";
import { Skeleton } from "@/components/ui/skeleton";

const montserrat = Montserrat({
  subsets: ["latin"],
});

interface SidebarProps {
  freeCharacterCount: number;
  isPro: boolean;
  proCharacterCount: number;
}

const routes = [
  {
    label: "Dashboard",
    icon: PiHouse,
    href: "/dashboard",
    color: "text-foreground",
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/dashboard/settings",
    color: "text-foreground",
  },
];

const chatbotCustomizationRoutes = [
  {
    label: "General",
    icon: FiLink,
    href: "/dashboard/chat",
    color: "text-foreground",
  },
  {
    label: "URL Links",
    icon: SlGlobe,
    href: "/dashboard/url-links",
    color: "text-foreground",
  },
  {
    label: "FAQs",
    icon: MdOutlineQuestionAnswer,
    href: "/dashboard/faqs",
    color: "text-foreground",
  },
];

const chatbotRoutes = [
  {
    label: "Create Chatbot",
    icon: FaRobot,
    href: "/dashboard/create-chatbot",
    color: "text-foreground",
  },
  {
    label: "Edit Your Chatbot",
    icon: MdModeEdit,
    href: "/dashboard/edit-chatbot",
    color: "text-foreground",
  },
  {
    label: "Install Your Chatbot",
    icon: MdDownload,
    href: "/dashboard/install-chatbot",
    color: "text-foreground",
  },
];

const Sidebar = ({ credits }: { credits: number | undefined }) => {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  console.log(session);

  return (
    <div className="space-y-4 py-4 flex flex-col text-background top-[var(--nav-height)] overflow-y-auto slim-scroll sticky justify-between  h-fullscreen border-r px-2 md:block w-[200px] xl:w-[290px]">
      <div className="space-y-1">
        {routes.map((route) => (
          <Link
            href={route.href}
            key={route.href}
            className={`text-sm group flex p-4 cursor-pointer hover:text-background hover:bg-foreground/80 rounded-lg transition,
                ${
                  pathname === route.href
                    ? "bg-white/10 text-foreground"
                    : "text-foreground"
                }
              `}
          >
            <div className="flex items-center flex-1">
              <route.icon
                className={cn(
                  "w-6 h-6 mr-3 group-hover:text-background",
                  route.color
                )}
              />
              {route.label}
            </div>
          </Link>
        ))}
      </div>
      <div className="space-y-1">
        <h3 className="text-zinc-600 p-4 ">Knowledge Base</h3>
        <Separator orientation="horizontal" className="w-full" />
        {chatbotCustomizationRoutes.map((route) => (
          <Link
            href={route.href}
            key={route.href}
            className={cn(
              "text-sm group flex p-4 cursor-pointer hover:text-background hover:bg-foreground/80 rounded-lg transition",
              `${
                pathname === route.href
                  ? "bg-white/10 text-foreground"
                  : "text-foreground"
              }
          `
            )}
          >
            <div className="flex items-center flex-1">
              <route.icon
                className={cn(
                  "w-6 h-6 mr-3 group-hover:text-background",
                  route.color
                )}
              />
              {route.label}
            </div>
          </Link>
          //   </Tooltip>
        ))}
      </div>
      <div className="space-y-1">
        <h3 className="text-zinc-600 p-4 ">Your Chatbot</h3>
        <Separator orientation="horizontal" className="w-full" />
        {chatbotRoutes.map((route) => (
          <Link
            href={route.href}
            key={route.href}
            className={cn(
              "text-sm group flex p-4 cursor-pointer hover:text-background hover:bg-foreground/80 rounded-lg transition",
              `${
                pathname === route.href
                  ? "bg-white/10 text-foreground"
                  : "text-foreground"
              }
          `
            )}
          >
            <div className="flex items-center flex-1">
              <route.icon
                className={cn(
                  "w-6 h-6 mr-3 group-hover:text-background",
                  route.color
                )}
              />
              {route.label}
            </div>
          </Link>
        ))}
      </div>

      {status === "loading" ? (
        <Loader />
      ) : (
        <div className="flex flex-row items-center gap-3 text-foreground h-[100px] mb-10 w-full p-4">
          {/* <UserAvatar/> */}
          <Avatar>
            <AvatarImage src={session?.user?.image || ""}></AvatarImage>
            <AvatarFallback>BW</AvatarFallback>
          </Avatar>
          <div className="flex flex-col p-1">
            <h4>{session?.user?.name}</h4>
            <p className="text-xs text-foreground/50">{credits} credits left</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;

const Loader = () => {
  return (
    <div className="flex flex-row items-center gap-3 text-foreground h-[100px] mb-10 w-full p-4">
      {/* <UserAvatar/> */}
      <Avatar>
        <AvatarFallback className="animate-pulse rounded-md bg-muted">
          A
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col gap-1 w-full p-1">
        <Skeleton className="w-[10ch] h-3" />
        <Skeleton className="w-full h-3" />
      </div>
    </div>
  );
};
