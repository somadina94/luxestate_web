"use client";
import ChatWindow from "@/components/organisms/chat-window";
import { useParams } from "next/navigation";
import { useAppSelector, RootState, AuthState } from "@/store";
import { useState, useEffect } from "react";
import { chatService } from "@/services";
import { Conversation } from "@/types";

export default function ChatWindowTemplate() {
  const { id } = useParams();
  const { user, access_token } = useAppSelector(
    (state: RootState) => state.auth,
  ) as AuthState;
  const [recipientName, setRecipientName] = useState("");
  const [propertyTitle, setPropertyTitle] = useState("");

  useEffect(() => {
    if (!access_token || !id) return;
    let cancelled = false;
    (async () => {
      const res = await chatService.getConversations(access_token);
      if (cancelled || res.status !== 200 || !Array.isArray(res.data)) return;
      const conv = (res.data as Conversation[]).find((c) => c.id === Number(id));
      if (!conv) return;
      setPropertyTitle(conv.property_title ?? "");
      if (user?.role === "buyer") {
        setRecipientName(
          [conv.agent_first_name, conv.agent_last_name].filter(Boolean).join(" ") || "Agent"
        );
      } else if (user?.role === "seller" || user?.role === "admin") {
        setRecipientName(
          [conv.user_first_name, conv.user_last_name].filter(Boolean).join(" ") || "User"
        );
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [access_token, id, user?.role]);

  const currentUserName =
    [user?.first_name, user?.last_name].filter(Boolean).join(" ") || "";

  return (
    <div className="h-full min-h-0 flex flex-col">
      <ChatWindow
        conversationId={Number(id)}
        userId={user?.id ?? 0}
        accessToken={access_token}
        recipientName={recipientName}
        currentUserName={currentUserName}
        propertyTitle={propertyTitle}
      />
    </div>
  );
}
