import type { Metadata } from "next";
import Gallery from "@/components/organisms/gallery";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Manage property gallery images.",
};

export default function GalleryPage() {
  return (
    <div className="p-4">
      <Gallery />
    </div>
  );
}
