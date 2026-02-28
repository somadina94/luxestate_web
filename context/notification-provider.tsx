"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useCallback,
} from "react";
import notificationService from "@/services/notifications/notification-service";
import { subscribeToPush } from "@/utils/subscribe-to-push-notification";

type NotificationContextType = {
  notifyUnreadChanged: () => void;
  requestPermissionAndSubscribe: () => Promise<void>;
};

const NotificationContext = createContext<NotificationContextType>({
  notifyUnreadChanged: () => {},
  requestPermissionAndSubscribe: async () => {},
});

const VAPID_KEY =
  (typeof process !== "undefined" &&
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY?.trim()) ||
  "";

export function NotificationProvider({
  accessToken,
  children,
}: {
  accessToken: string | null;
  children: React.ReactNode;
}) {
  const subscribedRef = useRef(false);

  const subscribeWebPush = useCallback(async () => {
    if (!accessToken || !VAPID_KEY || subscribedRef.current) return;
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) return;
    try {
      const reg = await navigator.serviceWorker.register("/sw.js", {
        scope: "/",
      });
      await reg.update();
      const payload = await subscribeToPush(VAPID_KEY);
      if (!payload) return;
      const res = await notificationService.subscribeWebPush(
        { subscription: payload },
        accessToken,
      );
      if (res.status === 201) subscribedRef.current = true;
    } catch {
      // subscription failed
    }
  }, [accessToken]);

  const requestPermissionAndSubscribe = useCallback(async () => {
    if (!accessToken || !VAPID_KEY) return;
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) return;
    if (Notification.permission === "granted") {
      await subscribeWebPush();
      return;
    }
    if (Notification.permission === "denied") return;

    try {
      // Request permission FIRST so the prompt runs in the user-gesture context.
      const permission = await Notification.requestPermission();
      if (permission !== "granted") return;

      const reg = await navigator.serviceWorker.register("/sw.js", {
        scope: "/",
      });
      await reg.update();
      const payload = await subscribeToPush(VAPID_KEY, { skipPermission: true });
      if (!payload) return;
      const res = await notificationService.subscribeWebPush(
        { subscription: payload },
        accessToken,
      );
      if (res.status === 201) subscribedRef.current = true;
    } catch {
      // subscription failed
    }
  }, [accessToken, subscribeWebPush]);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      "Notification" in window &&
      Notification.permission === "granted"
    ) {
      subscribeWebPush();
    }
  }, [subscribeWebPush]);

  const notifyUnreadChanged = useCallback(() => {
    window.dispatchEvent(new CustomEvent("notification:unread-changed"));
  }, []);

  return (
    <NotificationContext.Provider
      value={{ notifyUnreadChanged, requestPermissionAndSubscribe }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotificationContext() {
  return useContext(NotificationContext);
}
