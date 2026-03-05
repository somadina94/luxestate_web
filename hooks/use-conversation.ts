"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useWS } from "@/context/websocker-provider";
import { Message, ChatWSPayload } from "@/types";
import { chatService } from "@/services";

/** API message shape (backend may send created_at or timestamp) */
type ApiMessage = Omit<Message, "timestamp"> & {
  created_at?: string;
  timestamp?: string;
  is_read?: boolean;
};

/** WebSocket payloads we may receive */
type WSIncoming =
  | ChatWSPayload
  | { type: "subscribed"; conversation_id: number }
  | { type: "read_receipt"; conversation_id: number; message_ids: number[] };

function toMessage(api: ApiMessage): Message {
  return {
    id: api.id,
    conversation_id: api.conversation_id,
    sender_id: api.sender_id,
    content: api.content,
    timestamp: api.created_at ?? api.timestamp ?? new Date().toISOString(),
    is_read: api.is_read ?? false,
  };
}

function sortMessagesByTime(msgs: Message[]): Message[] {
  return [...msgs].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
  );
}

export const useConversation = (
  conversationId?: number,
  accessToken?: string | null,
  currentUserId?: number,
) => {
  const { socket, send } = useWS();
  const [messages, setMessages] = useState<Message[]>([]);
  const [deliveredMessageIds, setDeliveredMessageIds] = useState<Set<number>>(
    () => new Set(),
  );
  const [readMessageIds, setReadMessageIds] = useState<Set<number>>(
    () => new Set(),
  );
  const [loading, setLoading] = useState(true);
  const [subscribed, setSubscribed] = useState(false);
  const loadedConversationId = useRef<number | null>(null);

  // Subscribe to conversation when opening it; unsubscribe on leave
  useEffect(() => {
    if (!socket || conversationId == null) return;

    queueMicrotask(() => setSubscribed(false));

    const doSubscribe = () => {
      send({ type: "subscribe", conversation_id: conversationId });
    };

    if (socket.readyState === WebSocket.OPEN) {
      doSubscribe();
    } else {
      socket.addEventListener("open", doSubscribe);
    }

    const handler = (event: MessageEvent) => {
      const data = JSON.parse(event.data) as WSIncoming;
      if ("conversation_id" in data && data.conversation_id !== conversationId)
        return;
      if (data.type === "subscribed") {
        setSubscribed(true);
      }
    };

    socket.addEventListener("message", handler);

    return () => {
      socket.removeEventListener("message", handler);
      socket.removeEventListener("open", doSubscribe);
      send({ type: "unsubscribe", conversation_id: conversationId });
      queueMicrotask(() => setSubscribed(false));
    };
  }, [socket, conversationId, send]);

  // Load persisted messages when opening a conversation
  useEffect(() => {
    if (!conversationId || !accessToken) {
      queueMicrotask(() => setLoading(false));
      return;
    }
    let cancelled = false;
    queueMicrotask(() => setLoading(true));
    (async () => {
      const res = await chatService.getMessages(conversationId, accessToken);
      if (cancelled) return;
      setLoading(false);
      if (res.status === 200 && Array.isArray(res.data)) {
        loadedConversationId.current = conversationId;
        const apiMessages = res.data as ApiMessage[];
        const msgs = apiMessages.map(toMessage);
        setMessages(sortMessagesByTime(msgs));
        if (currentUserId != null) {
          const readIds = apiMessages
            .filter((m) => m.sender_id === currentUserId && m.is_read)
            .map((m) => m.id);
          setReadMessageIds(new Set(readIds));
        }
      } else {
        setMessages([]);
        setReadMessageIds(new Set());
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [conversationId, accessToken, currentUserId]);

  // Append WebSocket messages to current list (no persistence; reload restores from API)
  useEffect(() => {
    if (!socket || conversationId === undefined) return;

    const handler = (event: MessageEvent) => {
      const data = JSON.parse(event.data) as WSIncoming;

      if ("conversation_id" in data && data.conversation_id !== conversationId)
        return;

      if (data.type === "new_message") {
        const msg = (data as ChatWSPayload & { message: Message }).message;
        setMessages((prev) => {
          if (prev.some((m) => m.id === msg.id)) return prev;
          return sortMessagesByTime([...prev, msg]);
        });
      } else if (data.type === "delivered") {
        setDeliveredMessageIds((prev) =>
          new Set(prev).add(
            (data as ChatWSPayload & { message_id: number }).message_id,
          ),
        );
      } else if (data.type === "read_receipt") {
        const ids = (data as { message_ids: number[] }).message_ids ?? [];
        if (ids.length > 0) {
          setReadMessageIds((prev) => new Set([...prev, ...ids]));
        }
      }
    };

    socket.addEventListener("message", handler);

    return () => socket.removeEventListener("message", handler);
  }, [socket, conversationId]);

  const markAsRead = useCallback(
    (convId: number, messageIds: number[]) => {
      if (messageIds.length === 0) return;
      send({ type: "read", conversation_id: convId, message_ids: messageIds });
    },
    [send],
  );

  const sendMessage = useCallback(
    (payload: {
      conversation_id: number;
      sender_id: number;
      content: string;
    }) => {
      send({
        type: "message",
        conversation_id: payload.conversation_id,
        content: payload.content,
      });
    },
    [send],
  );

  return {
    messages,
    deliveredMessageIds,
    readMessageIds,
    sendMessage,
    markAsRead,
    loading,
    subscribed,
  };
};
