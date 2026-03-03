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
      className={`flex flex-row justify-between items-center cursor-pointer bg-primary/20 mx-auto max-w-5xl w-full hover:bg-primary/50 dark:hover:bg-primary/50 transition-all duration-300 max-w-200 border  gap-2 p-2 rounded-md shadow-sm dark:bg-muted ${isUnread ? "bg-primary dark:bg-primary/20" : ""}`}
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
