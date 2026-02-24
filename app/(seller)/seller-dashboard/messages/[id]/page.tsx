import ChatWindowTemplate from "@/components/templates/chat-window";

export default function ChatWindowPage() {
  return (
    <div className="p-4 h-[calc(100vh-5rem)] flex flex-col min-h-0">
      <ChatWindowTemplate />
    </div>
  );
}
