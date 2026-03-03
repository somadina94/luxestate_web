"use client";

import { useAppSelector, RootState, AuthState } from "@/store";
import { Notification } from "@/types";
import { trimToLength, formatMessageTime } from "@/utils/helpers";
import { useRouter } from "next/navigation";

interface NotificationItemProps {
  notification: Notification;
}

export default function NotificationItem({
  notification,
}: NotificationItemProps) {
  const { user } = useAppSelector(
    (state: RootState) => state.auth,
  ) as AuthState;
  const router = useRouter();

  let path = "/notifications";
  if (user?.role === "buyer") {
    path = `/buyer-dashboard/notifications/${notification.id}`;
  } else if (user?.role === "seller") {
    path = `/seller-dashboard/notifications/${notification.id}`;
  } else if (user?.role === "admin") {
    path = `/admin-dashboard/notifications/${notification.id}`;
  }

  const isUnread = !notification.is_read;

  return (
    <div
      onClick={() => {
        router.push(path);
      }}
      className={`flex flex-row justify-between items-center cursor-pointer mx-auto max-w-5xl w-full transition-all duration-300 max-w-200 border gap-2 p-2 rounded-md shadow-sm ${isUnread ? "bg-gradient-to-br from-[#d9480f]/90 via-[#1c7ed6]/90 to-orange-500/90 hover:from-[#d9480f] hover:via-[#1c7ed6] hover:to-orange-500 text-white [&_.text-muted-foreground]:text-white/90" : "bg-primary/20 hover:bg-primary/50 dark:hover:bg-primary/50 dark:bg-muted"}`}
    >
      <div className="flex flex-col">
        <h3 className="text-lg font-medium">{notification.title}</h3>
        <p className="text-sm text-muted-foreground">
          {trimToLength(notification.body, 60)}...
        </p>
      </div>
      <p className="text-sm text-muted-foreground">
        {formatMessageTime(notification.created_at)}
      </p>
    </div>
  );
}
