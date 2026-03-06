"use client";
import { useEffect, useState } from "react";
import { subscriptionService } from "@/services";
import { useAppSelector, RootState, AuthState } from "@/store";
import { Subscription } from "@/types";
import Loading from "../atoms/loading";
import NoResult from "../atoms/no-result";
import { toast } from "sonner";
import SubscriptionItem from "../organisms/subscription-item";

export default function ActiveSubscription() {
  const { access_token } = useAppSelector(
    (state: RootState) => state.auth,
  ) as AuthState;
  const [activeSubscription, setActiveSubscription] =
    useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActiveSubscription = async () => {
      setLoading(true);
      const response = await subscriptionService.getMyActiveSubscription(
        access_token as string,
      );
      if (response.status === 200) {
        setActiveSubscription(response.data);
      } else {
        toast.error(response.message || "Failed to fetch active subscription");
      }
      setLoading(false);
    };
    if (access_token) {
      fetchActiveSubscription();
    }
  }, [access_token]);

  if (loading) {
    return <Loading />;
  }

  if (!activeSubscription) {
    return (
      <div className="flex flex-col gap-4 mx-auto max-w-2xl w-full">
        <h5 className="text-lg font-bold">Active Subscription</h5>
        <NoResult />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl w-full">
      <h5 className="text-lg font-bold">Active Subscription</h5>
      <SubscriptionItem subscription={activeSubscription} />
    </div>
  );
}
