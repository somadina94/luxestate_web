import type { Metadata } from "next";
import AdminProperties from "@/components/templates/admin-properties";

export const metadata: Metadata = {
  title: "Properties",
  description: "Browse and search properties on Luxestate.",
};

export default function PropertiesPage() {
  return (
    <div className="p-4">
      <AdminProperties />
    </div>
  );
}
