import type { Metadata } from "next";
import ResetPasswordForm from "@/components/templates/reset-password-form";

export const metadata: Metadata = {
  title: "Reset password",
  description: "Set a new password for your Luxestate account.",
};

export default function ResetPasswordPage() {
  return (
    <div className="mx-auto max-w-120">
      <ResetPasswordForm />
    </div>
  );
}
