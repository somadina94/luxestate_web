import AboutHero from "@/components/organisms/about-hero";
import AboutFeatures from "@/components/organisms/about-features";
import AboutRoles from "@/components/organisms/about-roles";
import AboutCta from "@/components/organisms/about-cta";

export const metadata = {
  title: "About | Luxestate",
  description:
    "Learn about Luxestate: property search, realtime chat, seller subscriptions, tickets, notifications, and roles for buyers, sellers, and admins.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <AboutHero />
      <AboutFeatures />
      <AboutRoles />
      <AboutCta />
    </div>
  );
}
