import type { Metadata } from "next";
import SellerProperties from "@/components/templates/seller-properties";

export const metadata: Metadata = {
  title: "Properties",
  description: "Manage your listed properties on Luxestate.",
};

export default function PropertiesPage() {
  return (
    <div className="p-4">
      <SellerProperties />
    </div>
  );
}
