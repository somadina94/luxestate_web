"use client";

import { useState, useEffect } from "react";
import { useAppSelector, RootState, AuthState } from "@/store";
import { notificationService } from "@/services";
import { Notification } from "@/types";
import NotificationItem from "../organisms/notification-item";
import Loading from "../atoms/loading";
import { toast } from "sonner";

export default function NotificationsList() {
  const { access_token } = useAppSelector(
    (state: RootState) => state.auth,
  ) as AuthState;
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      const res = await notificationService.listNotifications(
        access_token as string,
      );
      if (res.status === 200) {
        setNotifications(res.data);
      } else {
        toast.error(res.message);
      }
      setLoading(false);
    };
    fetchNotifications();
  }, [access_token]);

  if (loading) {
    return <Loading />;
  }
  if (notifications.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No notifications found.
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-4 mx-auto max-w-3xl w-full">
      <h1 className="text-2xl font-bold">Notifications</h1>
      {notifications.map((notification) => (
        <NotificationItem key={notification.id} notification={notification} />
      ))}
    </div>
  );
}
