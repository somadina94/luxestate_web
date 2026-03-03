import type { Metadata } from "next";
import LoginForm from "@/components/templates/login-form";

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to your Luxestate account.",
};

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-120">
      <LoginForm />
    </div>
  );
}
