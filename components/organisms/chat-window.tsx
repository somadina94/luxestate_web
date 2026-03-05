"use client";
import { useConversation } from "@/hooks/use-conversation";
import { useState, useRef, useEffect } from "react";
import { Check, CheckCheck, SendIcon } from "lucide-react";
import { Textarea } from "../ui/textarea";
import Loading from "../atoms/loading";
import { formatMessageTime } from "@/utils/helpers";

export default function ChatWindow({
  conversationId,
  userId,
  accessToken,
  recipientName = "",
  currentUserName = "",
  propertyTitle = "",
}: {
  conversationId: number;
  userId: number;
  accessToken: string | null;
  recipientName?: string;
  currentUserName?: string;
  propertyTitle?: string;
}) {
  const {
    messages,
    deliveredMessageIds,
    readMessageIds,
    sendMessage,
    markAsRead,
    loading,
    subscribed,
  } = useConversation(conversationId, accessToken, userId);
  const [text, setText] = useState("");
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const bottomSentinelRef = useRef<HTMLDivElement>(null);

  // Mark received messages as read when chat window is open (backend requirement over WebSocket)
  useEffect(() => {
    if (!subscribed || !messages.length || !conversationId) return;
    const receivedIds = messages
      .filter((m) => m.sender_id !== userId)
      .map((m) => m.id);
    if (receivedIds.length > 0) {
      markAsRead(conversationId, receivedIds);
      // Notify header to refetch unread count after backend has time to process
      const t = setTimeout(() => {
        window.dispatchEvent(new CustomEvent("chat:unread-changed"));
      }, 400);
      return () => clearTimeout(t);
    }
  }, [subscribed, messages, conversationId, userId, markAsRead]);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const scrollToBottom = () => {
      bottomSentinelRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(scrollToBottom);
    });
    return () => cancelAnimationFrame(raf);
  }, [messages]);

  const handleSend = () => {
    sendMessage({
      conversation_id: conversationId,
      sender_id: userId,
      content: text,
    });

    setText("");
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col h-full min-h-0">
      <div
        ref={scrollContainerRef}
        className="flex-1 min-h-0 overflow-y-auto flex flex-col"
      >
        <div className="p-2 flex flex-col gap-2">
          {messages.map((m) => {
            const isOwn = m.sender_id === userId;
            const senderName = isOwn
              ? (currentUserName || "You")
              : (recipientName || "Unknown");
            return (
              <div
                key={m.id}
                className={`flex flex-col gap-0.5 max-w-[85%] shrink-0 ${
                  isOwn ? "ml-auto" : "mr-auto"
                }`}
              >
                <span
                  className={`text-xs font-medium text-muted-foreground ${
                    isOwn ? "text-right" : "text-left"
                  }`}
                >
                  {senderName}
                </span>
                {propertyTitle ? (
                  <span
                    className={`text-[11px] text-muted-foreground/80 truncate ${
                      isOwn ? "text-right" : "text-left"
                    }`}
                  >
                    {propertyTitle}
                  </span>
                ) : null}
                <p
                  className={`text-sm p-4 rounded-md text-primary ${
                    isOwn
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground"
                  }`}
                >
                  {m.content}
                </p>
                <span className="text-xs text-muted-foreground flex items-center gap-1 justify-end">
                {formatMessageTime(m.timestamp)}
                {isOwn && (
                  <>
                    {readMessageIds.has(m.id) ? (
                      <CheckCheck
                        className="w-3.5 h-3.5 text-primary shrink-0"
                        aria-label="Read"
                      />
                    ) : deliveredMessageIds.has(m.id) ? (
                      <CheckCheck
                        className="w-3.5 h-3.5 text-muted-foreground shrink-0"
                        aria-label="Delivered"
                      />
                    ) : (
                      <Check
                        className="w-3.5 h-3.5 text-muted-foreground shrink-0"
                        aria-label="Sent"
                      />
                    )}
                  </>
                )}
              </span>
            </div>
            );
          })}
        </div>
        <div ref={bottomSentinelRef} aria-hidden />
        <div className="sticky bottom-0 shrink-0 flex flex-row gap-2 p-2 bg-background items-center">
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="border-2 border-gray-300 rounded-md p-2 min-h-[80px] resize-none"
          />
          <SendIcon
            className="cursor-pointer text-primary"
            size={32}
            onClick={handleSend}
          />
        </div>
      </div>
    </div>
  );
}
