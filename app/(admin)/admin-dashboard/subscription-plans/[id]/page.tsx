"use client";

import { useParams } from "next/navigation";
import UpdateSubscriptionPlanForm from "@/components/organisms/update-subscription-plan-form";

export default function UpdateSubscriptionPlanPage() {
  const params = useParams();
  const id = parseInt(String(params?.id ?? ""), 10);
  if (Number.isNaN(id)) {
    return (
      <div className="p-4 text-destructive">Invalid subscription plan ID.</div>
    );
  }
  return (
    <div className="p-4">
      <UpdateSubscriptionPlanForm subscriptionPlanId={id} />
    </div>
  );
}
