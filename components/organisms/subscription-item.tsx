import { Subscription } from "@/types";
import { formatDate } from "@/utils/helpers";

interface SubscriptionItemProps {
  subscription: Subscription;
}

export default function SubscriptionItem({
  subscription,
}: SubscriptionItemProps) {
  const isExpired = subscription.status === "expired";
  return (
    <div
      className={
        isExpired
          ? "flex flex-col gap-2 shadow-sm p-4 rounded-lg bg-muted dark:bg-gray-800 text-foreground"
          : "flex flex-col gap-2 shadow-sm p-4 rounded-lg bg-gradient-to-b from-[#f08c00] to-[#15aabf] text-white"
      }
    >
      <div className="flex flex-row gap-2 items-center justify-between">
        <span>Start Date:</span>
        <span>{formatDate(subscription.start_date)}</span>
      </div>
      <div className="flex flex-row gap-2 items-center justify-between">
        <span>End Date:</span>
        <span>{formatDate(subscription.end_date)}</span>
      </div>
      <div className="flex flex-row gap-2 items-center justify-between">
        <span>Status:</span>
        <span>{subscription.status}</span>
      </div>
      <div className="flex flex-row gap-2 items-center justify-between">
        <span>Listing Limit:</span>
        <span>{subscription.listing_limit}</span>
      </div>
      <div className="flex flex-row gap-2 items-center justify-between">
        <span>Created At:</span>
        <span>{formatDate(subscription.created_at)}</span>
      </div>
    </div>
  );
}
