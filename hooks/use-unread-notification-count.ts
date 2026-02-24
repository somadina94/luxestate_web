"use client";

import { useEffect, useState, useCallback } from "react";
import notificationService from "@/services/notifications/notification-service";

export function useUnreadNotificationCount(accessToken: string | null) {
  const [unreadCount, setUnreadCount] = useState(0);

  const refetch = useCallback(async () => {
    if (!accessToken) {
      setUnreadCount(0);
      return;
    }
    const res = await notificationService.getUnreadCount(accessToken);
    if (res.status === 200 && res.data) {
      setUnreadCount(res.data.unread_count ?? 0);
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

  useEffect(() => {
    const onUnreadChanged = () => refetch();
    window.addEventListener("notification:unread-changed", onUnreadChanged);
    return () =>
      window.removeEventListener("notification:unread-changed", onUnreadChanged);
  }, [refetch]);

  return { unreadCount, refetch };
}
