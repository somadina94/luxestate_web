"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useCallback,
} from "react";
import notificationService from "@/services/notifications/notification-service";

type NotificationContextType = {
  /** Trigger refetch of unread count everywhere (e.g. after push or mark read). */
  notifyUnreadChanged: () => void;
  /**
   * Call from a user gesture (e.g. click on bell). Requests notification permission
   * then subscribes to web push. Browsers only show the permission prompt for user gestures.
   */
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

/**
 * Provider that:
 * - Subscribes to Web Push when the user is authenticated (single place for subscription).
 * - Exposes notifyUnreadChanged so any component can tell the app to refresh unread counts.
 *
 * Unread count is consumed via useUnreadNotificationCount() in the header (same pattern as messages).
 */
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
      const permission = await Notification.requestPermission();
      if (permission !== "granted") return;

      const applicationServerKey = getVapidKeyBuffer(VAPID_KEY);
      if (!applicationServerKey) return;

      const subscription = await reg.pushManager.getSubscription();
      const sub = subscription
        ? subscription
        : await reg.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey,
          });

      const payload = sub.toJSON() as {
        endpoint: string;
        keys: { p256dh: string; auth: string };
      };
      const res = await notificationService.subscribeWebPush(
        { subscription: payload },
        accessToken,
      );
      if (res.status === 201) subscribedRef.current = true;
    } catch {
      // subscription failed
    }
  }, [accessToken]);

  /** Call from a user gesture (e.g. bell click). Requests permission then subscribes. */
  const requestPermissionAndSubscribe = useCallback(async () => {
    if (!accessToken || !VAPID_KEY) return;
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) return;
    if (Notification.permission === "granted") {
      await subscribeWebPush();
      return;
    }
    if (Notification.permission === "denied") return;

    try {
      const reg = await navigator.serviceWorker.register("/sw.js", {
        scope: "/",
      });
      await reg.update();
      const permission = await Notification.requestPermission();
      if (permission !== "granted") return;

      const applicationServerKey = getVapidKeyBuffer(VAPID_KEY);
      if (!applicationServerKey) return;

      let sub = await reg.pushManager.getSubscription();
      if (!sub) {
        sub = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey,
        });
      }

      const payload = sub.toJSON() as {
        endpoint: string;
        keys: { p256dh: string; auth: string };
      };
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

function urlBase64ToUint8Array(base64: string): BufferSource {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const b64 = (base64 + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(b64);
  const buffer = new ArrayBuffer(raw.length);
  const out = new Uint8Array(buffer);
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
  return out;
}

/**
 * Decode VAPID public key for PushManager.subscribe(applicationServerKey).
 * Expects base64url-encoded uncompressed P-256 public key.
 * - 65 bytes: use as-is (standard 0x04 + x + y).
 * - 64 bytes: prepend 0x04 (raw x||y from some backends).
 * - 66 bytes: use first 65.
 * Returns null if key is missing or invalid.
 */
function getVapidKeyBuffer(key: string): BufferSource | null {
  const trimmed = key.trim().replace(/^["']|["']$/g, "");
  if (!trimmed) return null;
  try {
    const decoded = urlBase64ToUint8Array(trimmed);
    const arr =
      decoded instanceof Uint8Array
        ? decoded
        : new Uint8Array(decoded as ArrayBuffer);
    const len = arr.length;
    if (len === 65) return decoded;
    if (len === 64) {
      const buffer = new ArrayBuffer(65);
      const out = new Uint8Array(buffer);
      out[0] = 0x04;
      out.set(arr, 1);
      return out;
    }
    if (len === 66) {
      const buffer = new ArrayBuffer(65);
      new Uint8Array(buffer).set(arr.subarray(0, 65));
      return new Uint8Array(buffer);
    }
    return null;
  } catch {
    return null;
  }
}
