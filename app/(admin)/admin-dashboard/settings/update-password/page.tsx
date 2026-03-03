import type { Metadata } from "next";
import UpdatePasswordForm from "@/components/templates/update-password-form";

export const metadata: Metadata = {
  title: "Update password",
  description: "Change your admin account password.",
};

export default function UpdatePasswordPage() {
  return (
    <div className="p-4">
      <UpdatePasswordForm />
    </div>
  );
}
