import type { Metadata } from "next";
import CreateSubscriptionPlanForm from "@/components/organisms/create-subscription-plan-form";

export const metadata: Metadata = {
  title: "Create subscription plan",
  description: "Create a new subscription plan.",
};

export default function NewSubscriptionPlanPage() {
  return (
    <div className="p-4">
      <CreateSubscriptionPlanForm />
    </div>
  );
}
