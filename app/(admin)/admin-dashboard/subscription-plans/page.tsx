import type { Metadata } from "next";
import AdminSubscriptionPlanList from "@/components/templates/admin-subscription-plan-list";

export const metadata: Metadata = {
  title: "Subscription plans",
  description: "Manage subscription plans.",
};

export default function SubscriptionPlansPage() {
  return (
    <div className="p-4">
      <AdminSubscriptionPlanList />
    </div>
  );
}
