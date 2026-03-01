"use client";

import TicketWindow from "@/components/organisms/ticket-window";
import { useParams } from "next/navigation";
import { useAppSelector, RootState, AuthState } from "@/store";

export default function TicketWindowTemplate() {
  const { id } = useParams();
  const { user, access_token } = useAppSelector(
    (state: RootState) => state.auth,
  ) as AuthState;

  return (
    <div className="h-full min-h-0 flex flex-col">
      <TicketWindow
        key={id as string}
        ticketId={Number(id)}
        userId={user?.id ?? 0}
        accessToken={access_token}
      />
    </div>
  );
}
