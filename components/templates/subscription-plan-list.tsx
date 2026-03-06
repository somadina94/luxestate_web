"use client";

import { useState, useEffect } from "react";
import { SubscriptionPlan } from "@/types";
import { subscriptionService } from "@/services";
import Loading from "../atoms/loading";
import SubscriptionPlanItem from "../organisms/subscription-plan-item";
import { useAppSelector, RootState, AuthState } from "@/store";
import NoResult from "../atoms/no-result";
import { toast } from "sonner";

export default function SubscriptionPlanList() {
  const { access_token } = useAppSelector(
    (state: RootState) => state.auth,
  ) as AuthState;
  const [subscriptionPlans, setSubscriptionPlans] = useState<
    SubscriptionPlan[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscriptionPlans = async () => {
      setLoading(true);
      try {
        const response = await subscriptionService.getSellerSubscriptionsPlans(
          access_token as string,
        );
        if (response.status === 200) {
          setSubscriptionPlans(response.data);
        } else {
          toast.error(response.message || "Failed to fetch subscription plans");
        }
      } catch {
        toast.error("Failed to fetch subscription plans");
      }
      setLoading(false);
    };
    if (access_token) {
      fetchSubscriptionPlans();
    }
  }, [access_token]);

  if (loading) {
    return <Loading />;
  }

  if (subscriptionPlans.length === 0) {
    return <NoResult />;
  }

  return (
    <div className="flex flex-col gap-4 mx-auto max-w-2xl w-full">
      <h5 className="text-lg font-bold">Subscription Plans</h5>
      {subscriptionPlans.map((subscriptionPlan) => (
        <SubscriptionPlanItem
          key={subscriptionPlan.id}
          subscriptionPlan={subscriptionPlan}
        />
      ))}
    </div>
  );
}
