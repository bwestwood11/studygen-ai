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
import { TbMessageChatbot } from "react-icons/tb";
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
    color: "text-zinc-400",
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/dashboard/settings",
    color: "text-zinc-400",
  },
];

const chatbotCustomizationRoutes = [
  {
    label: "Files",
    icon: FiLink,
    href: "/dashboard/upload-files",
    color: "text-zinc-400",
  },
  {
    label: "URL Links",
    icon: SlGlobe,
    href: "/dashboard/url-links",
    color: "text-zinc-400",
  },
  {
    label: "FAQs",
    icon: MdOutlineQuestionAnswer,
    href: "/dashboard/faqs",
    color: "text-zinc-400",
  },
];

const chatbotRoutes = [
  {
    label: "Create Chatbot",
    icon: FaRobot,
    href: "/dashboard/create-chatbot",
    color: "text-zinc-400",
  },
  {
    label: "Edit Your Chatbot",
    icon: MdModeEdit,
    href: "/dashboard/edit-chatbot",
    color: "text-zinc-400",
  },
  {
    label: "Install Your Chatbot",
    icon: MdDownload,
    href: "/dashboard/install-chatbot",
    color: "text-zinc-400",
  },
  {
    label: "Real Time Chat",
    icon: BsChatDots,
    href: "/dashboard/real-time-chat",
    color: "text-zinc-400",
  },
  {
    label: "Playground",
    icon: AiOutlineDeploymentUnit,
    href: "/dashboard/playground",
    color: "text-zinc-400",
  },
  {
    label: "Chat History",
    icon: BsChatRightText,
    href: "/dashboard/chat-history",
    color: "text-zinc-400",
  },
];

const Sidebar = () => {
  const { data: session } = useSession();
  const pathname = usePathname();

  return (
    <div className="space-y-4 py-4 flex flex-col fixed justify-between top-20 overflow-auto h-[calc(100svh-80px)] border-r text-black  md:block w-[200px] xl:w-[250px]">
      <div className="space-y-1">
        {routes.map((route) => (
          <Link
            href={route.href}
            key={route.href}
            className={`text-sm group flex p-4 cursor-pointer hover:text-black hover:bg-slate-50 rounded-lg transition,
                ${
                  pathname === route.href
                    ? "bg-white/10 text-zinc-400"
                    : "text-zinc-400"
                }
              `}
          >
            <div className="flex items-center flex-1">
              <route.icon className={cn("w-6 h-6 mr-3", route.color)} />
              {route.label}
            </div>
          </Link>
        ))}
      </div>
      <div className="space-y-1">
        <h3 className="text-zinc-600 p-4 ">Knowledge Base</h3>
        <Separator orientation="horizontal" className="w-full" />
        {chatbotCustomizationRoutes.map((route) => (
        //   <Tooltip
        //     key={route.href}
        //     sideOffset={10}
        //     side="right"
        //     content={
        //   `Go To ${route.label}`
        //     }
        //   >
            <Link
              href={route.href}
              key={route.href}
              className={cn("text-sm group flex p-4 cursor-pointer hover:text-black hover:bg-slate-50 rounded-lg transition",
                `${
                  pathname === route.href
                    ? "bg-white/10 text-zinc-400"
                    : "text-zinc-400"
                }
          `
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon
                  className={cn(
                    "w-6 h-6 mr-3",
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
        //   <Tooltip
        //     key={route.href}
        //     sideOffset={10}
        //     side="right"
        //     content={
        //         `Go To ${route.label}`
        //     }
        //   >
            <Link
              href={route.href}
              key={route.href}
              className={cn("text-sm group flex p-4 cursor-pointer hover:text-black hover:bg-slate-50 rounded-lg transition",
                `${
                  pathname === route.href
                    ? "bg-white/10 text-zinc-400"
                    : "text-zinc-400"
                }
          `
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon
                  className={cn(
                    "w-6 h-6 mr-3",
                    route.color
                  )}
                />
                {route.label}
              </div>
            </Link>
        //   </Tooltip>
        ))}
      </div>
      <div className="flex flex-row its-center gap-3 h-[100px] mb-10 w-full p-4">
        <Avatar>
          <AvatarImage src={session?.user?.image || ""}></AvatarImage>
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div className="flex flex-col p-1">
          <h4>{session?.user?.name}</h4>
          <Badge className="bg-[#2b9348] hover:bg-[#2b9348]/80 inline-flex w-fit text-white font-bold">
            Active
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
