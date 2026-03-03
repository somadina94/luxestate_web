import type { Metadata } from "next";
import TicketList from "@/components/templates/ticket-list";

export const metadata: Metadata = {
  title: "Tickets",
  description: "Your support tickets on Luxestate.",
};

export default function TicketsPage() {
  return (
    <div className="p-4">
      <TicketList />
    </div>
  );
}
