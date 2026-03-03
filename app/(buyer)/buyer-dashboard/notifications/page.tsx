import type { Metadata } from "next";
import NotificationsList from "@/components/templates/notifications-list";

export const metadata: Metadata = {
  title: "Notifications",
  description: "Your Luxestate notifications.",
};

export default function NotificationsPage() {
  return (
    <div className="p-4">
      <NotificationsList />
    </div>
  );
}
