"use client";
import { Ticket } from "@/types";
import { useAppSelector, RootState, AuthState } from "@/store";
import { useRouter } from "next/navigation";
import { formatMessageTime } from "@/utils/helpers";

interface TicketItemProps {
  ticket: Ticket;
}

export default function TicketItem({ ticket }: TicketItemProps) {
  const router = useRouter();
  const { user } = useAppSelector(
    (state: RootState) => state.auth,
  ) as AuthState;

  let path = `/tickets/${ticket.id}`;
  if (user?.role === "buyer") {
    path = `/buyer-dashboard/tickets/${ticket.id}`;
  } else if (user?.role === "seller") {
    path = `/seller-dashboard/tickets/${ticket.id}`;
  } else if (user?.role === "admin") {
    path = `/admin-dashboard/tickets/${ticket.id}`;
  }
  return (
    <div
      className={`flex flex-col relative cursor-pointer hover:bg-primary/10 transition-all duration-300 p-2 rounded-md shadow-sm ${ticket.status === "open" || ticket.status === "in_progress" ? "bg-green-800" : "bg-gray-500"}`}
      onClick={() => router.push(path)}
    >
      <p className="font-medium">{ticket.title}</p>
      <p className="text-muted-foreground text-sm">{ticket.status}</p>
      <p className="text-muted-foreground text-sm">
        {ticket.user?.first_name} {ticket.user?.last_name}
      </p>
      <p className="text-muted-foreground text-sm absolute top-0 bottom-0 right-4">
        {formatMessageTime(ticket.created_at)}
      </p>
    </div>
  );
}
