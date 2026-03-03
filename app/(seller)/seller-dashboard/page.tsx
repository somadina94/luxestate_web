import type { Metadata } from "next";
import SellerProperties from "@/components/templates/seller-properties";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your Luxestate seller dashboard — properties, messages, and more.",
};

export default function SellerDashboardHomepage() {
  return (
    <div className="p-4">
      <SellerProperties />
    </div>
  );
}
