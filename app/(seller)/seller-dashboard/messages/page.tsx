import type { Metadata } from "next";
import ChatListTemplate from "@/components/templates/chat-list";

export const metadata: Metadata = {
  title: "Messages",
  description: "Your conversations with buyers on Luxestate.",
};

export default function MessagesPage() {
  return (
    <div className="p-4">
      <ChatListTemplate />
    </div>
  );
}
