import type { Metadata } from "next";
import LoginVerify from "@/components/templates/login-verify";

export const metadata: Metadata = {
  title: "Verify login",
  description: "Verify your Luxestate login.",
};

export default function VerifyLoginPage() {
  return (
    <div className="mx-auto max-w-120">
      <LoginVerify />
    </div>
  );
}
