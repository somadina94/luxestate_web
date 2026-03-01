"use client";

import { useState, useRef, useEffect } from "react";
import { SendIcon } from "lucide-react";
import { Textarea } from "../ui/textarea";
import Loading from "../atoms/loading";
import { formatMessageTime } from "@/utils/helpers";
import { Ticket, TicketMessage } from "@/types";
import { ticketService } from "@/services";

const CAN_REPLY_STATUSES = ["open", "in_progress"];

export default function TicketWindow({
  ticketId,
  userId,
  accessToken,
  initialTicket,
}: {
  ticketId: number;
  userId: number;
  accessToken: string | null;
  initialTicket?: Ticket | null;
}) {
  const [ticket, setTicket] = useState<Ticket | null>(initialTicket ?? null);
  const [loading, setLoading] = useState(!initialTicket);
  const [sending, setSending] = useState(false);
  const [text, setText] = useState("");
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const bottomSentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    if (!accessToken) return;
    ticketService.getTicket(ticketId, accessToken).then((res) => {
      if (cancelled) return;
      if (res.status === 200 && res.data) {
        setTicket(res.data);
      }
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [ticketId, accessToken]);

  const isLoading = !!accessToken && (loading || (!!ticketId && !ticket));

  const refetchTicket = () => {
    ticketService.getTicket(ticketId, accessToken!).then((res) => {
      if (res.status === 200 && res.data) setTicket(res.data);
    });
  };

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el || !ticket?.messages?.length) return;
    bottomSentinelRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [ticket?.messages?.length]);

  const handleSend = async () => {
    const trimmed = text.trim();
    if (!trimmed || !accessToken || !ticket) return;
    if (!CAN_REPLY_STATUSES.includes(ticket.status ?? "")) return;

    setSending(true);
    const res = await ticketService.createTicketMessage(
      {
        ticket_id: ticketId,
        sender_id: userId,
        message: trimmed,
      },
      accessToken,
    );
    setSending(false);
    setText("");

    if (res.status === 201 || res.status === 200) {
      refetchTicket();
    }
  };

  if (isLoading || !ticket) {
    return <Loading />;
  }

  const messages: TicketMessage[] = ticket.messages ?? [];
  const canReply = CAN_REPLY_STATUSES.includes(ticket.status ?? "");
  const userName = ticket.user
    ? `${ticket.user.first_name} ${ticket.user.last_name}`.trim()
    : "—";

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Header: title, status, user name */}
      <header className="shrink-0 border-b bg-muted/30 px-4 py-3">
        <h1 className="font-semibold text-lg truncate">{ticket.title}</h1>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground mt-1">
          <span className="capitalize">{ticket.status ?? "—"}</span>
          <span>{userName}</span>
        </div>
      </header>

      {/* Messages */}
      <div
        ref={scrollContainerRef}
        className="flex-1 min-h-0 overflow-y-auto flex flex-col"
      >
        <div className="p-2 flex flex-col gap-2">
          {messages.map((m) => (
            <div
              key={m.id ?? `${m.created_at}-${m.message?.slice(0, 8)}`}
              className={`flex flex-col gap-0.5 max-w-[85%] shrink-0 ${
                m.sender_id === userId ? "ml-auto" : "mr-auto"
              }`}
            >
              <p
                className={`text-sm p-4 rounded-md text-primary ${
                  m.sender_id === userId
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                }`}
              >
                {m.message}
              </p>
              <span className="text-xs text-muted-foreground flex items-center gap-1 justify-end">
                {formatMessageTime(m.created_at)}
              </span>
            </div>
          ))}
        </div>
        <div ref={bottomSentinelRef} aria-hidden />

        {/* Reply area: only when status is open or in_progress */}
        {canReply && (
          <div className="sticky bottom-0 shrink-0 flex flex-row gap-2 p-2 bg-background items-center border-t">
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type a message..."
              className="border-2 border-gray-300 rounded-md p-2 min-h-[80px] resize-none"
              disabled={sending}
            />
            <SendIcon
              className="cursor-pointer text-primary shrink-0 disabled:opacity-50"
              size={32}
              onClick={handleSend}
              aria-label="Send"
            />
          </div>
        )}
      </div>
    </div>
  );
}
