import SubscriptionPlanList from "@/components/templates/subscription-plan-list";
import SellerSubscriptionList from "@/components/templates/seller-subscription-list";
import ActiveSubscription from "@/components/templates/active-subscription";

export default function BillingAndPayments() {
  return (
    <div className="mx-auto p-4 w-full flex flex-col gap-4">
      <h2 className="text-lg font-bold">Billing & Payments</h2>
      <SubscriptionPlanList />
      <ActiveSubscription />
      <SellerSubscriptionList />
    </div>
  );
}
