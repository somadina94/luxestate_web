"use client";

import { User, Store, ShieldCheck } from "lucide-react";
import AboutRoleCard from "@/components/molecules/about-role-card";

const ROLES = [
  {
    icon: User,
    role: "Buyer",
    description:
      "Browse and search properties, save favorites, and message sellers directly. Get real-time notifications and manage your inquiries in one dashboard.",
  },
  {
    icon: Store,
    role: "Seller",
    description:
      "List unlimited properties with a monthly subscription. Manage listings, respond to messages, and track interest—all from your seller dashboard.",
  },
  {
    icon: ShieldCheck,
    role: "Admin",
    description:
      "Full platform control: manage users, properties, tickets, subscriptions, and announcements. Analytics and moderation tools at your fingertips.",
  },
];

export default function AboutRoles() {
  return (
    <section
      className="px-4 py-16 md:px-8 lg:px-24"
      aria-labelledby="about-roles-heading"
    >
      <div className="mx-auto max-w-6xl">
        <h2
          id="about-roles-heading"
          className="text-center text-3xl font-bold tracking-tight text-foreground md:text-4xl"
        >
          Built for three roles
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-muted-foreground">
          Whether you’re looking to buy, sell, or run the platform, Luxestate
          adapts to your role.
        </p>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {ROLES.map((r) => (
            <AboutRoleCard
              key={r.role}
              icon={r.icon}
              role={r.role}
              description={r.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
