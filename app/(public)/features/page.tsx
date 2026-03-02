import FeaturesHero from "@/components/organisms/features-hero";
import FeaturesSection from "@/components/organisms/features-section";
import AboutCta from "@/components/organisms/about-cta";

export const metadata = {
  title: "Features | Luxestate",
  description:
    "Luxestate features: rich property search, realtime chat, seller subscriptions, support tickets, notifications, favorites, and more.",
};

export default function FeaturesPage() {
  return (
    <div className="min-h-screen">
      <FeaturesHero />
      <FeaturesSection />
      <AboutCta />
    </div>
  );
}
