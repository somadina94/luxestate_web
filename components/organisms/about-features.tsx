"use client";

import {
  Search,
  MessageCircle,
  CreditCard,
  Ticket,
  Bell,
  Shield,
  Sparkles,
  Heart,
} from "lucide-react";
import AboutFeatureCard from "@/components/molecules/about-feature-card";

const FEATURES = [
  {
    icon: Search,
    title: "Rich property search",
    description:
      "Filter by location, price, bedrooms, bathrooms, property type, size, and more. Sort and paginate to find the perfect listing.",
  },
  {
    icon: MessageCircle,
    title: "Realtime chat",
    description:
      "Message sellers and buyers instantly. Real-time conversations so you never miss an inquiry or follow-up.",
  },
  {
    icon: CreditCard,
    title: "Monthly subscription for sellers",
    description:
      "Unlimited listings with a simple monthly plan. List as many properties as you need without per-listing fees.",
  },
  {
    icon: Ticket,
    title: "Support tickets",
    description:
      "Open tickets for help or issues. Track status and get responses from the team in one place.",
  },
  {
    icon: Bell,
    title: "Notifications",
    description:
      "In-app and optional push notifications. Stay updated on new messages, ticket replies, and important updates.",
  },
  {
    icon: Heart,
    title: "Favorites",
    description:
      "Save properties you love and revisit them from your dashboard. Quick access to your shortlist.",
  },
  {
    icon: Shield,
    title: "Secure & verified",
    description:
      "Verified accounts and secure auth. Your data and transactions are protected.",
  },
  {
    icon: Sparkles,
    title: "Featured listings",
    description:
      "Highlight your best properties. Featured listings get more visibility across the platform.",
  },
];

export default function AboutFeatures() {
  return (
    <section
      className="border-border/50 border-y bg-muted/30 px-4 py-16 md:px-8 lg:px-24"
      aria-labelledby="about-features-heading"
    >
      <div className="mx-auto max-w-6xl">
        <h2
          id="about-features-heading"
          className="text-center text-3xl font-bold tracking-tight text-foreground md:text-4xl"
        >
          Everything you need
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-muted-foreground">
          From search to support, we’ve built the tools to make buying and
          selling property straightforward.
        </p>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature) => (
            <AboutFeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
