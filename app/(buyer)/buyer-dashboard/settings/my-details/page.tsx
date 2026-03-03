import type { Metadata } from "next";
import ProfileItem from "@/components/organisms/profile-item";

export const metadata: Metadata = {
  title: "My details",
  description: "View and edit your profile details.",
};

export default function MyDetailsPage() {
  return (
    <div className="p-4">
      <ProfileItem />
    </div>
  );
}
