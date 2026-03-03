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
  const isOpenOrInProgress =
    ticket.status === "open" || ticket.status === "in_progress";

  return (
    <div
      className={`flex flex-row justify-between items-center relative cursor-pointer transition-all duration-300 p-2 rounded-md shadow-sm border ${isOpenOrInProgress ? "bg-gradient-to-br from-[#d9480f]/90 via-[#1c7ed6]/90 to-orange-500/90 hover:from-[#d9480f] hover:via-[#1c7ed6] hover:to-orange-500 text-white [&_.text-muted-foreground]:text-white/90" : "bg-primary/20 hover:bg-primary/50 dark:hover:bg-primary/50"}`}
      onClick={() => router.push(path)}
    >
      <div className="flex flex-col">
        <p className="font-medium">{ticket.title}</p>
        <p className="text-muted-foreground text-sm">{ticket.status}</p>
        <p className="text-muted-foreground text-sm">
          {ticket.user?.first_name} {ticket.user?.last_name}
        </p>
      </div>
      <p className="text-muted-foreground text-sm">
        {formatMessageTime(ticket.created_at)}
      </p>
    </div>
  );
}
