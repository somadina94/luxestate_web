"use client";

function urlBase64ToUint8Array(base64: string): ArrayBuffer | Uint8Array {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const base64Safe = (base64 + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64Safe);
  const out = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
  return out;
}

/**
 * Decode VAPID public key for PushManager.subscribe(applicationServerKey).
 * Expects base64url-encoded uncompressed P-256 public key.
 * - 65 bytes: use as-is (standard 0x04 + x + y).
 * - 64 bytes: prepend 0x04 (raw x||y from some backends).
 * - 66 bytes: use first 65.
 */
export function getVapidKeyBuffer(key: string): ArrayBuffer | Uint8Array | null {
  const trimmed = key.trim().replace(/^["']|["']$/g, "");
  if (!trimmed) return null;
  try {
    const decoded = urlBase64ToUint8Array(trimmed);
    const arr =
      decoded instanceof Uint8Array ? decoded : new Uint8Array(decoded);
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

export type PushSubscriptionPayload = {
  endpoint: string;
  keys: { p256dh: string; auth: string };
};

type SubscribeToPushOptions = {
  /** If true, skip Notification.requestPermission() (caller already requested). */
  skipPermission?: boolean;
};

/**
 * Request notification permission (unless skipPermission) and subscribe to push.
 * Uses navigator.serviceWorker.ready, so the caller must have registered a service worker (e.g. /sw.js) first.
 * Returns the subscription payload to send to your backend, or null if permission denied or subscription fails.
 */
export async function subscribeToPush(
  vapidKey: string,
  options: SubscribeToPushOptions = {},
): Promise<PushSubscriptionPayload | null> {
  if (!options.skipPermission) {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") return null;
  }

  const applicationServerKey = getVapidKeyBuffer(vapidKey);
  if (!applicationServerKey) return null;

  const reg = await navigator.serviceWorker.ready;
  const existing = await reg.pushManager.getSubscription();
  const subscription = existing ?? await reg.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: applicationServerKey as BufferSource,
  });

  const keys = subscription.getKey("p256dh")
    ? btoa(
        String.fromCharCode(
          ...new Uint8Array(subscription.getKey("p256dh")!),
        ),
      )
    : "";
  const auth = subscription.getKey("auth")
    ? btoa(
        String.fromCharCode(...new Uint8Array(subscription.getKey("auth")!)),
      )
    : "";

  return {
    endpoint: subscription.endpoint,
    keys: { p256dh: keys, auth },
  };
}
