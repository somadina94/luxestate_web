"use client";
import { Button } from "@/components/ui/button";
import { useLogout } from "@/hooks/use-logout";

export default function SellerDashboardHomepage() {
  const logout = useLogout();
  return (
    <div>
      <Button onClick={logout}>logout</Button>
    </div>
  );
}
