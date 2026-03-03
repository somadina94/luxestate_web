import type { Metadata } from "next";
import PropertyDetail from "@/components/organisms/property-detail";

export const metadata: Metadata = {
  title: "Property",
  description: "View property details on Luxestate.",
};

export default function PropertyDetailPage() {
  return (
    <div className="p-4">
      <PropertyDetail />
    </div>
  );
}
