import type { Metadata } from "next";
import AddProperty from "@/components/templates/add-property";

export const metadata: Metadata = {
  title: "Add property",
  description: "List a new property on Luxestate.",
};

export default function AddPropertyPage() {
  return (
    <div className="p-4">
      <AddProperty />
    </div>
  );
}
