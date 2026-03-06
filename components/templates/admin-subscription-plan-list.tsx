"use client";

import { useState, useEffect } from "react";
import { SubscriptionPlan } from "@/types";
import { subscriptionService } from "@/services";
import Loading from "../atoms/loading";
import NoResult from "../atoms/no-result";
import { toast } from "sonner";
import { useAppSelector, RootState, AuthState } from "@/store";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusIcon } from "lucide-react";
import { formatAmount } from "@/utils/helpers";
import { Card, CardContent } from "@/components/ui/card";

export default function AdminSubscriptionPlanList() {
  const { access_token } = useAppSelector(
    (state: RootState) => state.auth,
  ) as AuthState;
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      setLoading(true);
      const response = await subscriptionService.getSellerSubscriptionsPlans(
        access_token as string,
      );
      if (response.status === 200) {
        setPlans(response.data ?? []);
      } else {
        toast.error(
          (response as { message?: string }).message ??
            "Failed to fetch subscription plans",
        );
      }
      setLoading(false);
    };
    if (access_token) fetchPlans();
  }, [access_token]);

  if (loading) return <Loading />;

  return (
    <div className="flex flex-col gap-4 mx-auto max-w-3xl w-full">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-bold">Subscription plans</h1>
        <Button asChild size="sm">
          <Link href="/admin-dashboard/subscription-plans/new">
            <PlusIcon className="h-4 w-4 mr-2" />
            Create subscription plan
          </Link>
        </Button>
      </div>
      {plans.length === 0 ? (
        <NoResult />
      ) : (
        <div className="flex flex-col gap-4">
          {plans.map((plan) => (
            <Card key={plan.id}>
              <CardContent className="pt-4">
                <div className="grid gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Name</span>
                    <span className="font-medium">{plan.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Description</span>
                    <span>{plan.description}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Price</span>
                    <span>
                      {plan.currency} {formatAmount(plan.price)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Duration</span>
                    <span>
                      {plan.duration} {plan.duration_type}
                      {plan.duration !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Listing limit</span>
                    <span>{plan.listing_limit}</span>
                  </div>
                </div>
                <div className="mt-4">
                  <Button asChild variant="outline" size="sm">
                    <Link
                      href={`/admin-dashboard/subscription-plans/${plan.id}`}
                    >
                      Update
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
