import type { Metadata } from "next";
import Hero from "@/components/molecules/hero";
import Featured from "@/components/organisms/featured";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Luxestate — discover and list properties. Browse featured listings and find your next home.",
};

export default function HomePage() {
  return (
    <div className="">
      <Hero />
      <Featured />
    </div>
  );
}
