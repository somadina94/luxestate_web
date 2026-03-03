import type { Metadata } from "next";
import SignupForm from "@/components/templates/sign-up-form";

export const metadata: Metadata = {
  title: "Sign up",
  description: "Create a Luxestate account to browse, list, or manage properties.",
};

export default function SignupPage() {
  return (
    <div className="mx-auto max-w-120">
      <SignupForm />
    </div>
  );
}
