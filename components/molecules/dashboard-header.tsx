"use client";
import { useAppSelector, RootState, AuthState } from "@/store";
import { useUnreadCount } from "@/hooks/use-unread-count";
import { useUnreadNotificationCount } from "@/hooks/use-unread-notification-count";
import { useNotificationContext } from "@/context/notification-provider";
import { useRouter } from "next/navigation";

import {
  MessageCircle,
  Bell,
  TicketIcon,
  User,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import { useOpenTicketCount } from "@/hooks/use-open-ticket-count";

export default function DashboardHeader() {
  const router = useRouter();
  const { user, access_token } = useAppSelector(
    (state: RootState) => state.auth,
  ) as AuthState;
  const { unreadCount } = useUnreadCount(access_token ?? null);
  const { unreadCount: unreadNotificationCount } = useUnreadNotificationCount(
    access_token ?? null,
  );
  const { openCount: openTicketCount } = useOpenTicketCount(
    access_token ?? null,
  );
  const { requestPermissionAndSubscribe } = useNotificationContext();

  const handleBellClick = (e: React.MouseEvent) => {
    requestPermissionAndSubscribe();
    router.push(notificationsPath);
  };

  let path = "buyer-dashboard/messages";
  let notificationsPath = "/buyer-dashboard/notifications";
  let ticketsPath = "/buyer-dashboard/tickets";
  if (user?.role === "buyer") {
    path = "/buyer-dashboard/messages";
    notificationsPath = "/buyer-dashboard/notifications";
    ticketsPath = "/buyer-dashboard/tickets";
  } else if (user?.role === "seller") {
    path = "/seller-dashboard/messages";
    notificationsPath = "/seller-dashboard/notifications";
    ticketsPath = "/seller-dashboard/tickets";
  } else if (user?.role === "admin") {
    path = "/admin-dashboard/messages";
    notificationsPath = "/admin-dashboard/notifications";
    ticketsPath = "/admin-dashboard/tickets";
  }
  return (
    <header className="text-center flex flex-row justify-end px-4 border-b h-30 sticky top-0 z-10 bg-background/90">
      <div className="flex flex-row justify-center gap-4 items-center max-w-60 w-full border-r mr-4">
        <Link
          href={path}
          className=" w-8 h-8 md:w-14 md:h-14 rounded-2xl bg-muted flex justify-center items-center relative"
        >
          <MessageCircle className="text-primary w-3 h-3 md:w-5 md:h-5" />
          {unreadCount > 0 && (
            <p className="min-w-3 min-h-3 md:min-w-6 md:min-h-6  bg-destructive rounded-full text-white flex justify-center items-center text-[8px] md:text-sm absolute top-1 right-1">
              {unreadCount > 99 ? "99+" : unreadCount}
            </p>
          )}
        </Link>
        <button
          type="button"
          onClick={handleBellClick}
          className=" w-8 h-8 md:w-14 md:h-14 cursor-pointer rounded-2xl bg-muted flex justify-center items-center relative"
        >
          <Bell size={24} className="text-primary w-3 h-3 md:w-5 md:h-5" />
          {unreadNotificationCount > 0 && (
            <p className="min-w-3 min-h-3 md:min-w-6 md:min-h-6  bg-destructive rounded-full text-white flex justify-center items-center text-[8px] md:text-sm absolute top-1 right-1">
              {unreadNotificationCount > 99 ? "99+" : unreadNotificationCount}
            </p>
          )}
        </button>
        <Link
          href={ticketsPath}
          className=" w-8 h-8 md:w-14 md:h-14 rounded-2xl bg-muted flex justify-center items-center relative"
        >
          <TicketIcon className="text-primary w-3 h-3 md:w-5 md:h-5" />
          {openTicketCount > 0 && (
            <p className="min-w-3 min-h-3 md:min-w-6 md:min-h-6  bg-destructive rounded-full text-white flex justify-center items-center text-[8px] md:text-sm absolute top-1 right-1">
              {openTicketCount > 99 ? "99+" : openTicketCount}
            </p>
          )}
        </Link>
      </div>
      <div className="flex flex-row justify-between items-center p-4">
        <div className="flex flex-row justify-between items-center gap-4">
          <div className="flex flex-col items-end">
            <span className="font-semibold text-[10px] md:text-[16px] block">{`${user?.first_name} ${user?.last_name[0]}`}</span>
            <span className="text-sm">{user?.role}</span>
          </div>
          <div className="w-6 h-6 md:w-14 md:h-14 rounded-lg bg-muted-foreground flex justify-center items-center">
            <User className="text-primary w-3 h-3 md:w-5 md:h-5" />
          </div>
          <div className="flex flex-row justify-center items-center gap-2 bg-muted p-2 rounded-md">
            <span className="text-sm md:text-lg">EN</span>
            <ChevronDown className="w-3 h-3 md:w-5 md:h-5" />
          </div>
        </div>
      </div>
    </header>
  );
}
