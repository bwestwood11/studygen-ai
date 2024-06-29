"use client";

import { GenerateContentAction } from "@/actions/gemini.action";
import { usePurchaseModal } from "@/components/modal/purchase-credits";
import { useRouter } from "next/navigation";
import { FormEvent, useRef, useState } from "react";
import { useServerAction } from "zsa-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import {
  ArrowUpIcon,
  ClipboardIcon,
  Loader,
  RefreshCcwIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
} from "lucide-react";
import { Message } from "@/lib/types/messages";
import ChatMessages from "./_components/chat-messages";
import { Input } from "@/components/ui/input";

const ChatPage = () => {
  const { isPending, execute, data } = useServerAction(GenerateContentAction);
  const [messages, setMessages] = useState<Message[]>([]);
  const formRef = useRef<HTMLFormElement | null>(null);

  const router = useRouter();
  const { openModal } = usePurchaseModal();

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const question = formData.get("question") as string;

    if (!question) {
      return;
    }

    formRef.current?.reset();

    setMessages((prev) => [
      ...prev,
      {
        message: question,
        by: "user",
      },
    ]);

    const [data, err] = await execute({
      question,
      history: messages,
    });

    if (err) {
      if (err.code === "INSUFFICIENT_CREDITS") {
        openModal();
      } else if (err.code === "NOT_AUTHORIZED") {
        router.replace("/auth/login");
      } else {
        console.error(err);
        alert("Something Went Wrong");
      }
    } else if (data) {
      setMessages((prev) => [
        ...prev,
        {
          message: data,
          by: "model",
        },
      ]);
    }
  };

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      className="flex flex-col h-fullscreen w-full   bg-background text-foreground"
    >
      <header className="flex items-center gap-3 px-4 py-3 border-b">
        <Avatar className="w-8 h-8 border ">
          <AvatarFallback className="bg-primary text-primary-foreground">
            SB
          </AvatarFallback>
        </Avatar>
        <div className="text-sm font-medium">Study Buddy</div>
      </header>

      <ChatMessages messages={messages} isPending={isPending} />

      <div className="border-t mt-auto p-4">
        <div className="relative">
          <Input
            placeholder="Message ChatGPT..."
            name="question"
            id="question"
            className="min-h-[48px] rounded-2xl resize-none p-4 border border-neutral-400 shadow-sm pr-16"
          />
          <Button
            type="submit"
            size="icon"
            className="absolute w-8 h-8 top-1/2 right-3 translate-y-[-50%]"
            disabled={isPending}
          >
            {isPending ? (
              <Loader className="w-4 h-4" />
            ) : (
              <ArrowUpIcon className="w-4 h-4" />
            )}
            <span className="sr-only">Send</span>
          </Button>
        </div>
        <p className="text-xs font-medium text-center text-neutral-700">
          ChatGPT can make mistakes. Consider checking important information.
        </p>
      </div>
    </form>
  );
};

export default ChatPage;
