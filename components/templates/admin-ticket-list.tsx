"use client";
import { useState, useEffect, useMemo } from "react";
import { useAppSelector, RootState, AuthState } from "@/store";
import { ticketService } from "@/services";
import { Ticket } from "@/types";
import { toast } from "sonner";
import TicketItem from "../organisms/ticket-item";
import Loading from "../atoms/loading";
import NoResult from "../atoms/no-result";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type StatusFilter = "all" | "open" | "in_progress" | "closed";

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All tickets" },
  { value: "open", label: "Open" },
  { value: "in_progress", label: "In progress" },
  { value: "closed", label: "Closed" },
];

export default function AdminTicketList() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const { access_token } = useAppSelector(
    (state: RootState) => state.auth,
  ) as AuthState;

  useEffect(() => {
    const fetchTickets = async () => {
      setLoading(true);
      const res = await ticketService.getTickets(access_token as string);
      if (res.status === 200) {
        setTickets(res.data ?? []);
      } else {
        toast.error(
          (res as { message?: string }).message ?? "Failed to load tickets",
        );
      }
      setLoading(false);
    };
    fetchTickets();
  }, [access_token]);

  const filteredTickets = useMemo(() => {
    if (statusFilter === "all") return tickets;
    return tickets.filter((t) => (t.status ?? "") === statusFilter);
  }, [tickets, statusFilter]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col gap-4 mx-auto max-w-3xl w-full">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-bold">Tickets</h1>
        <Select
          value={statusFilter}
          onValueChange={(v) => setStatusFilter(v as StatusFilter)}
        >
          <SelectTrigger className="w-[160px]" size="sm">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {statusFilter !== "all" && (
        <p className="text-sm text-muted-foreground">
          Showing {filteredTickets.length} of {tickets.length} tickets
        </p>
      )}
      {filteredTickets.length === 0 ? (
        <NoResult />
      ) : (
        <div className="flex flex-col gap-4">
          {filteredTickets.map((ticket) => (
            <TicketItem key={ticket.id} ticket={ticket} />
          ))}
        </div>
      )}
    </div>
  );
}
