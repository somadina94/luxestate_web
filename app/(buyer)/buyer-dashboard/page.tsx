import type { Metadata } from "next";
import AdminProperties from "@/components/templates/admin-properties";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your Luxestate buyer dashboard — properties, favorites, messages, and more.",
};

export default function PropertiesPage() {
  return (
    <div className="p-4">
      <AdminProperties />
    </div>
  );
}
