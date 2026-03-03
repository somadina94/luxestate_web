import type { Metadata } from "next";
import AddImage from "@/components/organisms/add-image";

export const metadata: Metadata = {
  title: "Add image",
  description: "Add an image to the property gallery.",
};

export default function AddImagePage() {
  return (
    <div className="p-4">
      <AddImage />
    </div>
  );
}
