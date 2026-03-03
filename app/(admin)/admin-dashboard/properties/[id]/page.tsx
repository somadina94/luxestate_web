import type { Metadata } from "next";
import AdminPropertyDetail from "@/components/templates/admin-property-detail";

export const metadata: Metadata = {
  title: "Property",
  description: "View and manage property (admin).",
};

export default function AdminPropertyDetailPage() {
  return (
    <div className="p-4">
      <AdminPropertyDetail />
    </div>
  );
}
