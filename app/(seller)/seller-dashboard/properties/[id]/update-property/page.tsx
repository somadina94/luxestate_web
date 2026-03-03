import type { Metadata } from "next";
import UpdateProperty from "@/components/templates/update-property";

export const metadata: Metadata = {
  title: "Update property",
  description: "Edit your property listing.",
};

export default function UpdatePropertyPage() {
  return (
    <div className="p-4">
      <UpdateProperty />
    </div>
  );
}
