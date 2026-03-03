import type { Metadata } from "next";
import ChatList from "@/components/templates/chat-list";

export const metadata: Metadata = {
  title: "Messages",
  description: "Your conversations with sellers on Luxestate.",
};

export default function MessagesPage() {
  return (
    <div className="p-4">
      <ChatList />
    </div>
  );
}
