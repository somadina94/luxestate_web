"use client";

import { Subscription, SubscriptionPlan } from "@/types";
import IconButton from "../atoms/IconButton";
import { CreditCardIcon } from "lucide-react";
import { subscriptionService } from "@/services";
import { toast } from "sonner";
import { useAppSelector, RootState, AuthState } from "@/store";
import { useEffect, useState } from "react";
import { formatAmount } from "@/utils/helpers";

interface SubscriptionPlanItemProps {
  subscriptionPlan: SubscriptionPlan;
}

export default function SubscriptionPlanItem({
  subscriptionPlan,
}: SubscriptionPlanItemProps) {
  const { access_token } = useAppSelector(
    (state: RootState) => state.auth,
  ) as AuthState;
  const [activeSubscription, setActiveSubscription] =
    useState<Subscription | null>(null);
  const [loading, setLoading] = useState(false);
  const handleBuySubscription = async () => {
    setLoading(true);
    const response = await subscriptionService.createCheckoutSession(
      access_token as string,
      subscriptionPlan.id,
    );
    if (response.status === 200) {
      console.log(response.data);
      window.location.href = response.data.url;
    } else {
      toast.error(response.message || "Failed to buy subscription");
    }
    setLoading(false);
  };

  useEffect(() => {
    // Get the active subscription
    const fetchActiveSubscription = async () => {
      const response = await subscriptionService.getMyActiveSubscription(
        access_token as string,
      );
      if (response.status === 200) {
        setActiveSubscription(response.data);
      } else {
        toast.error(response.message || "Failed to fetch active subscription");
      }
    };
    fetchActiveSubscription();
  }, [access_token]);

  const hasActiveSubscription =
    activeSubscription?.status === "paid" &&
    new Date(activeSubscription?.end_date) > new Date();

  return (
    <div className="flex flex-col gap-2 shadow-sm p-4 rounded-lg bg-gradient-to-b from-[#f06595] to-[#1c7ed6] text-white ">
      <div className="flex flex-row gap-2 items-center justify-between">
        <span>Name:</span>
        <span>{subscriptionPlan.name}</span>
      </div>
      <div className="flex flex-row gap-2 items-center justify-between">
        <span>Description:</span>
        <span>{subscriptionPlan.description}</span>
      </div>
      <div className="flex flex-row gap-2 items-center justify-between">
        <span>Price:</span>
        <span>{formatAmount(subscriptionPlan.price)}</span>
      </div>
      <div className="flex flex-row gap-2 items-center justify-between">
        <span>Currency:</span>
        <span>{subscriptionPlan.currency}</span>
      </div>
      <div className="flex flex-row gap-2 items-center justify-between">
        <span>Duration:</span>
        <span>{subscriptionPlan.duration}</span>
      </div>
      <div className="flex flex-row gap-2 items-center justify-between">
        <span>Listing Limit:</span>
        <span>{subscriptionPlan.listing_limit}</span>
      </div>
      <IconButton
        Icon={CreditCardIcon}
        onClick={handleBuySubscription}
        isLoading={loading}
        title="Buy Subscription"
        className="w-full"
        disabled={hasActiveSubscription}
      />
    </div>
  );
}
