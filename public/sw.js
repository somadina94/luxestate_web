/* Minimal service worker for Web Push. No imports - runs as static script. */

self.addEventListener("push", (event) => {
  if (!event.data) return;
  let payload = { title: "Notification", body: "" };
  try {
    payload = event.data.json();
  } catch (_) {
    payload.body = event.data.text();
  }
  const options = {
    body: payload.body,
    data: payload.data || {},
    tag: "luxestate-notification",
    renotify: true,
  };
  event.waitUntil(
    self.registration.showNotification(payload.title || "Luxestate", options),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const data = event.notification.data || {};
  const path =
    data.path ||
    "/buyer-dashboard/notifications";
  const fullUrl = new URL(path, self.location.origin).href;

  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        const sameOrigin = clientList.filter(
          (c) => c.url && new URL(c.url).origin === self.location.origin
        );
        const target = sameOrigin.length > 0 ? sameOrigin[0] : null;
        if (target) {
          target.navigate(fullUrl);
          target.focus();
        } else if (self.clients.openWindow) {
          self.clients.openWindow(fullUrl);
        }
      }),
  );
});
