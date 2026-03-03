import type { Metadata } from "next";
import Favorites from "@/components/templates/favorites";

export const metadata: Metadata = {
  title: "Favorites",
  description: "Your saved favorite properties on Luxestate.",
};

export default function FavoritesPage() {
  return (
    <div className="p-4">
      <Favorites />
    </div>
  );
}
