import type { Metadata } from "next";
import TicketWindowTemplate from "@/components/templates/ticket-window";

export const metadata: Metadata = {
  title: "Ticket",
  description: "View and reply to support ticket.",
};

export default function TicketDetailPage() {
  return (
    <div className="p-4 h-[calc(100vh-5rem)] flex flex-col min-h-0">
      <TicketWindowTemplate />
    </div>
  );
}
