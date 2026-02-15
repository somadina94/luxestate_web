"use client";
import IconButton from "@/components/atoms/IconButton";
import { LightDarkToggle } from "@/components/atoms/light-dark-toggle";
import { LogOut } from "lucide-react";
import { useLogout } from "@/hooks/use-logout";
import Link from "next/link";

export default function HomePage() {
  const logout = useLogout();
  return (
    <div className="flex items-center gap-4 justify-center h-screen">
      <LightDarkToggle />
      <IconButton title="Logout" Icon={LogOut} onClick={logout} />
      <Link href="/login">Login</Link>
    </div>
  );
}
