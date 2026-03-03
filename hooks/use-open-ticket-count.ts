"use client";

import { useEffect, useState, useCallback } from "react";
import { ticketService } from "@/services";
import { Ticket } from "@/types";

const OPEN_STATUSES = ["open", "in_progress"];

function isOpenOrInProgress(ticket: Ticket): boolean {
  return OPEN_STATUSES.includes(ticket.status ?? "");
}

export function useOpenTicketCount(accessToken: string | null) {
  const [openCount, setOpenCount] = useState(0);

  const refetch = useCallback(async () => {
    if (!accessToken) {
      setOpenCount(0);
      return;
    }
    const res = await ticketService.getUserTickets(accessToken);
    if (res.status === 200 && Array.isArray(res.data)) {
      const count = (res.data as Ticket[]).filter(isOpenOrInProgress).length;
      setOpenCount(count);
    } else {
      setOpenCount(0);
    }
  }, [accessToken]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    const onFocus = () => refetch();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [refetch]);

  return { openCount, refetch };
}
