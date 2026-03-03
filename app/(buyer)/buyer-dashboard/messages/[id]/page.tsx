import type { Metadata } from "next";
import ChatWindowTemplate from "@/components/templates/chat-window";

export const metadata: Metadata = {
  title: "Conversation",
  description: "Chat with seller about a property.",
};

export default function ChatWindowPage() {
  return (
    <div className="p-4 h-[calc(100vh-5rem)] flex flex-col min-h-0">
      <ChatWindowTemplate />
    </div>
  );
}
