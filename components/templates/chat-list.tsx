"use client";

import { useAppSelector, RootState, AuthState } from "@/store";
import { useState, useEffect, useCallback } from "react";
import { Conversation } from "@/types";
import { chatService } from "@/services";
import { toast } from "sonner";
import ChatItem from "../organisms/chat-item";
import Loading from "../atoms/loading";

export default function ChatList() {
  const { access_token } = useAppSelector(
    (state: RootState) => state.auth,
  ) as AuthState;

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastMessageTimes, setLastMessageTimes] = useState<
    Record<number, number>
  >({});

  const onLastMessageTime = useCallback(
    (conversationId: number, timestamp: string) => {
      const ms = new Date(timestamp).getTime();
      setLastMessageTimes((prev) =>
        prev[conversationId] === ms ? prev : { ...prev, [conversationId]: ms },
      );
    },
    [],
  );

  useEffect(() => {
    const fetchConversations = async () => {
      setLoading(true);
      const res = await chatService.getConversations(access_token as string);
      if (res.status === 200) {
        setConversations(res.data);
      } else {
        toast.error(res.message);
      }
      setLoading(false);
    };
    fetchConversations();
  }, [access_token]);

  const sortedConversations = [...conversations].sort(
    (a, b) => (lastMessageTimes[b.id!] ?? 0) - (lastMessageTimes[a.id!] ?? 0),
  );

  if (loading) {
    return <Loading />;
  }
  return (
    <div className="flex flex-col gap-4 mx-auto max-w-3xl w-full">
      <h1 className="text-2xl font-bold">Chats</h1>
      {sortedConversations.map((conversation) => (
        <ChatItem
          key={conversation.id}
          conversation={conversation}
          onLastMessageTime={onLastMessageTime}
        />
      ))}
    </div>
  );
}
