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
    <header className="px-2 text-white bg-transparent flex flex-row items-center justify-between py-2 absolute top-6 right-0 left-0 md:right-24 md:left-24 border rounded-lg">
      <Link href="/" className="font-bold text-lg md:text-3xl">
        LUXESTATE
      </Link>
      <div className="flex flex-row items-center gap-2 md:gap-4 text-sm md:text-lg">
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
