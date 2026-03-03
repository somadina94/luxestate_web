import type { Metadata } from "next";
import AdminStats from "@/components/molecules/admin-stats";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Luxestate admin dashboard — overview and management.",
};

export default function AdminPage() {
  return (
    <div className="p-4">
      <AdminStats />
    </div>
  );
}
