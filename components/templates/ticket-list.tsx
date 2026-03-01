"use client";
import { useState, useEffect } from "react";
import { useAppSelector, RootState, AuthState } from "@/store";
import { ticketService } from "@/services";
import { Ticket } from "@/types";
import { toast } from "sonner";
import TicketItem from "../organisms/ticket-item";
import Loading from "../atoms/loading";
import NoResult from "../atoms/no-result";
import IconButton from "../atoms/IconButton";
import { PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export default function TicketList() {
  const router = useRouter();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(false);
  const { access_token, user } = useAppSelector(
    (state: RootState) => state.auth,
  ) as AuthState;

  useEffect(() => {
    const fetchTickets = async () => {
      setLoading(true);
      const res = await ticketService.getUserTickets(access_token as string);
      if (res.status === 200) {
        setTickets(res.data);
      } else {
        toast.error(res.message);
      }
      setLoading(false);
    };
    fetchTickets();
  }, [access_token, user?.id]);

  if (loading) {
    return <Loading />;
  }
  let path = "/tickets";
  if (user?.role === "buyer") {
    path = "/buyer-dashboard/tickets";
  } else if (user?.role === "seller") {
    path = "/seller-dashboard/tickets";
  } else if (user?.role === "admin") {
    path = "/admin-dashboard/tickets";
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row justify-between items-center">
        <h1 className="text-2xl font-bold">Tickets</h1>
        <IconButton
          title="New Ticket"
          onClick={() => router.push(`${path}/new-ticket`)}
          Icon={PlusIcon}
          variant="outline"
          className="text-primary"
        />
      </div>
      {tickets.length === 0 ? (
        <NoResult />
      ) : (
        <div className="flex flex-col gap-4">
          {tickets.map((ticket) => (
            <TicketItem key={ticket.id} ticket={ticket} />
          ))}
        </div>
      )}
    </div>
  );
}
