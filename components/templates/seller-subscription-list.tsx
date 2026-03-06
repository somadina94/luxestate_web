"use client";

import { useState, useEffect } from "react";
import { Subscription } from "@/types";
import { subscriptionService } from "@/services";
import Loading from "../atoms/loading";
import SubscriptionItem from "../organisms/subscription-item";
import { useAppSelector, RootState, AuthState } from "@/store";
import NoResult from "../atoms/no-result";
import { toast } from "sonner";

export default function SellerSubscriptionList() {
  const { access_token } = useAppSelector(
    (state: RootState) => state.auth,
  ) as AuthState;
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      setLoading(true);
      const response = await subscriptionService.getMySubscriptions(
        access_token as string,
      );
      if (response.status === 200) {
        const expiredOnly = (response.data as Subscription[]).filter(
          (s) => s.status === "expired",
        );
        const sorted = [...expiredOnly].sort(
          (a, b) =>
            new Date(b.created_at ?? 0).getTime() -
            new Date(a.created_at ?? 0).getTime(),
        );
        setSubscriptions(sorted);
      } else {
        toast.error(response.message || "Failed to fetch subscriptions");
      }
      setLoading(false);
    };
    if (access_token) {
      fetchSubscriptions();
    }
  }, [access_token]);

  if (loading) {
    return <Loading />;
  }

  if (subscriptions.length === 0) {
    return (
      <div className="flex flex-col gap-4 mx-auto max-w-2xl w-full">
        <h5 className="text-sm font-semibold">Subscriptions history</h5>
        <NoResult />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 mx-auto max-w-2xl w-full">
      <h5 className="text-sm font-semibold">Subscriptions history</h5>
      {subscriptions.map((subscription) => (
        <SubscriptionItem key={subscription.id} subscription={subscription} />
      ))}
    </div>
  );
}
