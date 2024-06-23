"use client";

import { UserAvatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Message } from "@/lib/types/messages";
import { CheckIcon, ClipboardIcon } from "lucide-react";
import { Session } from "next-auth";
import { signIn, useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";

const ChatMessages = ({
  messages,
  isPending,
}: {
  messages: Message[];
  isPending: boolean;
}) => {
  const session = useSession();

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (!session.data) {
    return signIn();
  }
  return (
    <div>
      <div className="flex-1 overflow-auto p-4">
        {messages.map((message, index) => (
          <ChatMessage
            message={message}
            user={session.data?.user}
            key={index}
          />
        ))}

        {isPending ? <Loader /> : null}
        <div ref={messagesEndRef}></div>
      </div>
    </div>
  );
};

export default ChatMessages;

const Loader = () => {
  return (
    <div className="flex items-start gap-4 mt-6">
      <UserAvatar name="Study Buddy" ProfileSrc="" alt="Chatbot Image" />
      <div className="grid gap-1">
        <div className="font-bold">Study Buddy</div>
        <div className="prose text-muted-foreground px-6 py-2 ">
          <div className="loader" />
        </div>
      </div>
    </div>
  );
};

const ChatMessage = ({
  message,
  user,
}: {
  message: Message;
  user: Session["user"];
}) => {
  if (message.by === "model") {
    return (
      <div className="flex items-start gap-4 mt-6">
        <UserAvatar name="Study Buddy" ProfileSrc="" alt="Chatbot Image" />
        <div className="grid gap-1">
          <div className="font-bold">Study Buddy</div>
          <div className="prose text-muted-foreground">{message.message}</div>
          <div className="flex items-center gap-2 py-2">
            <Copy content={message.message} />
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="flex items-start gap-4">
      <UserAvatar
        name={user?.name || "You"}
        ProfileSrc={user?.image || ""}
        alt={user?.name || "User Image"}
      />
      <div className="grid gap-1">
        <div className="font-bold">You</div>
        <div className="prose text-muted-foreground">{message.message}</div>
      </div>
    </div>
  );
};

const Copy = ({ content }: { content: string }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyClick = () => {
    setIsCopied(true);
    navigator.clipboard.writeText(content);
    setTimeout(() => {
      setIsCopied(false);
    }, 1000);
  };
  return (
    <Button
      variant="ghost"
      size="icon"
      className="w-4 h-4 hover:bg-transparent text-stone-400 hover:text-stone-900"
      onClick={handleCopyClick}
    >
      {isCopied ? (
        <CheckIcon className="w-4 h-4" />
      ) : (
        <ClipboardIcon className="w-4 h-4" />
      )}
      <span className="sr-only">Copy</span>
    </Button>
  );
};
