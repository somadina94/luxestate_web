// class SubscriptionPlanDurationType(str, enum.Enum):
//     DAY = "day"
//     MONTH = "month"
//     YEAR = "year"

// class SubscriptionPlan(Base):
//     __tablename__ = "subscription_plans"
//     id = Column(Integer, primary_key=True)
//     name = Column(String, nullable=False)
//     description = Column(Text, nullable=False)
//     price = Column(Float, nullable=False)
//     currency = Column(String(3), default="USD")
//     duration = Column(Integer, nullable=False)
//     duration_type = Column(SqlEnum(SubscriptionPlanDurationType), nullable=False)
//     listing_limit = Column(Integer, default=30, nullable=False)
//     created_at = Column(DateTime(timezone=True), server_default=func.now())
//     updated_at = Column(DateTime(timezone=True), onupdate=func.now())

export interface SubscriptionPlan {
  id: number;
  name: string;
  description: string;
  price: number;
  currency: string;
  duration: number;
  duration_type: SubscriptionPlanDurationType;
  listing_limit: number;
  created_at?: string;
  updated_at?: string;
}

export enum SubscriptionPlanDurationType {
  DAY = "day",
  MONTH = "month",
  YEAR = "year",
}
