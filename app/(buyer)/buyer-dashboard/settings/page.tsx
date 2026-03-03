import type { Metadata } from "next";
import Settings from "@/components/templates/settings";

export const metadata: Metadata = {
  title: "Settings",
  description: "Manage your Luxestate account settings.",
};

export default function SettingsPage() {
  return (
    <div className="p-4">
      <Settings />
    </div>
  );
}
