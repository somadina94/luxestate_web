"use client";
import heroBg from "@/assets/hero-bg.jpg";
import GeneralHeader from "./general-header";
import Link from "next/link";
import { Button } from "../ui/button";
import { AuthState, RootState, useAppSelector } from "@/store";

export default function Hero() {
  const { isLoggedIn, user } = useAppSelector(
    (state: RootState) => state.auth,
  ) as AuthState;

  let path = "/login";

  if (isLoggedIn && user?.role === "admin") {
    path = "/admin-dashboard";
  } else if (isLoggedIn && user?.role === "buyer") {
    path = "/buyer-dashboard";
  } else if (isLoggedIn && user?.role === "seller") {
    path = "/seller-dashboard";
  }
  return (
    <section
      className="min-h-screen w-full flex items-center bg-cover bg-center px-4 md:px-24"
      style={{
        backgroundImage: `url(${heroBg.src})`,
        backgroundColor: `rgba(0,0,0,0.7)`,
      }}
    >
      <div className="absolute inset-0 bg-black/60" />
      <div className="z-10">
        {/* <GeneralHeader /> */}
        {/* <div className="absolute inset-0 bg-black/90" /> */}

        <div className="max-w-[500px]">
          <h1 className="text-4xl font-bold text-white mb-12">
            Discover Your Dream Property with Luxestate
          </h1>
          <p className="mb text-white">
            Your journey to finding the perfect property begins here. Explore
            our listings to find the home that matches your dreams.
          </p>
          <div className="flex flex-row gap-6 mt-12">
            <Button
              asChild
              variant="outline"
              className="bg-transparent border-2"
            >
              <Link href="/about" className="text-white">
                Learn More
              </Link>
            </Button>
            <Button asChild>
              <Link href={path} className="text-white">
                Browse Properties
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
