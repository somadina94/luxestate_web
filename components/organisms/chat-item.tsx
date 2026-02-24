"use client";

import { Conversation } from "@/types";
import { useAppSelector, RootState, AuthState } from "@/store";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useConversation } from "@/hooks/use-conversation";
import { formatMessageTime, trimToLength } from "@/utils/helpers";

interface ChatItemProps {
  conversation: Conversation;
  onLastMessageTime?: (conversationId: number, timestamp: string) => void;
}

export default function ChatItem({
  conversation,
  onLastMessageTime,
}: ChatItemProps) {
  const router = useRouter();
  const { user, access_token } = useAppSelector(
    (state: RootState) => state.auth,
  ) as AuthState;
  const { messages } = useConversation(conversation.id, access_token, user?.id);
  const lastMessage = messages[messages.length - 1];
  const lastMessageTime = lastMessage?.timestamp;

  useEffect(() => {
    if (
      conversation.id != null &&
      lastMessage?.timestamp &&
      onLastMessageTime
    ) {
      onLastMessageTime(conversation.id, lastMessage.timestamp);
    }
  }, [conversation.id, lastMessage?.timestamp, onLastMessageTime]);

  const isUnreadLastMessage =
    lastMessage && lastMessage.sender_id !== user?.id && !lastMessage.is_read;
  return (
    <div
      className={`cursor-pointer p-1 hover:bg-primary/10 transition-all duration-300 max-w-200 border rounded-md shadow-sm ${isUnreadLastMessage ? "bg-accent" : ""} `}
      onClick={() => {
        if (user?.role === "buyer") {
          router.push(`/buyer-dashboard/messages/${conversation.id}`);
        } else if (user?.role === "seller") {
          router.push(`/seller-dashboard/messages/${conversation.id}`);
        } else if (user?.role === "admin") {
          router.push(`/admin-dashboard/messages/${conversation.id}`);
        }
      }}
    >
      <div className="flex flex-col relative">
        {conversation.property_title && (
          <p className="font-medium">
            {user?.role === "buyer"
              ? `${conversation.agent_first_name} ${conversation.agent_last_name}`
              : `${conversation.user_first_name} ${conversation.user_last_name}`}
          </p>
        )}
        <p className="text-muted-foreground text-sm">
          {conversation.property_title}
        </p>
        <p className="text-muted-foreground text-sm">{`${trimToLength(lastMessage?.content ?? "", 60)}...`}</p>
        <p className="text-muted-foreground text-sm absolute bottom-4 right-4">{`${formatMessageTime(lastMessageTime)}`}</p>
      </div>
    </div>
  );
}
