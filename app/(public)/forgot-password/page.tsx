import type { Metadata } from "next";
import ForgotPasswordForm from "@/components/templates/forgot-password-form";

export const metadata: Metadata = {
  title: "Forgot password",
  description: "Reset your Luxestate account password.",
};

export default function ForgotPasswordPage() {
  return (
    <div className="mx-auto max-w-120">
      <ForgotPasswordForm />
    </div>
  );
}
