import type { Metadata } from "next";
import NotificationDetail from "@/components/organisms/notification-detail";

export const metadata: Metadata = {
  title: "Notification",
  description: "View notification details.",
};

export default function NotificationDetailPage() {
  return (
    <div className="p-4">
      <NotificationDetail />
    </div>
  );
}
