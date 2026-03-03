import type { Metadata } from "next";
import PropertyDetail from "@/components/organisms/property-detail";

export const metadata: Metadata = {
  title: "Property",
  description: "View property details.",
};

export default function BuyerPropertyDetailPage() {
  return (
    <div className="p-4">
      <PropertyDetail />
    </div>
  );
}
