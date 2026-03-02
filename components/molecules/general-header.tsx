"use client";
import { useAppSelector, RootState, AuthState } from "@/store";
import Link from "next/link";
import { Button } from "../ui/button";

export default function GeneralHeader() {
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
    <header className="sticky top-0 z-50 left-0 right-0 flex flex-row bg-linear-to-r items-center justify-between px-2 py-2 from-[#d9480f] via-[#1c7ed6] to-orange-500 text-white">
      <Link href="/" className="font-bold text-sm md:text-3xl">
        LUXESTATE
      </Link>
      <div className="flex flex-row items-center gap-2 md:gap-4 text-[10px] md:text-lg">
        <Link href="/">Home</Link>
        <Link href="/about">About Us</Link>
        <Link href="/properties">Properties</Link>
      </div>
      <Button asChild>
        <Link href={path} className="text-white">
          Dashboard
        </Link>
      </Button>
    </header>
  );
}
