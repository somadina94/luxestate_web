import type { Metadata } from "next";
import TicketForm from "@/components/organisms/ticket-form";

export const metadata: Metadata = {
  title: "New ticket",
  description: "Create a new support ticket.",
};

export default function NewTicketPage() {
  return (
    <div className="p-4">
      <TicketForm />
    </div>
  );
}
