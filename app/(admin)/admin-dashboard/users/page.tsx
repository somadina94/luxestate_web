import type { Metadata } from "next";
import AdminUserList from "@/components/templates/admin-user-list";

export const metadata: Metadata = {
  title: "Users",
  description: "Manage Luxestate users.",
};

export default function UsersPage() {
  return (
    <div className="p-4">
      <AdminUserList />
    </div>
  );
}
