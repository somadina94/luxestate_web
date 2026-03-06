export interface Subscription {
  id: number;
  name: string;
  user_id: number;
  subscription_plan_id: number;
  status: SubscriptionStatus;
  start_date: string;
  end_date: string;
  listing_limit: number;
  created_at?: string;
  updated_at?: string;
}

export enum SubscriptionStatus {
  EXPIRED = "expired",
  PAID = "paid",
  CANCELLED = "cancelled",
}
