import type { Metadata } from "next";
import EditImage from "@/components/organisms/edit-image";

export const metadata: Metadata = {
  title: "Edit image",
  description: "Edit gallery image.",
};

export default function EditImagePage() {
  return (
    <div className="p-4">
      <EditImage />
    </div>
  );
}
