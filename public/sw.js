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
  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        if (clientList.length > 0) {
          const client = clientList[0];
          client.navigate(path);
          client.focus();
        } else if (self.clients.openWindow) {
          self.clients.openWindow(new URL(path, self.location.origin));
        }
      }),
  );
});
