"use client";

import { useAppSelector, RootState, AuthState } from "@/store";
import { User } from "lucide-react";

export default function ProfileItem() {
  const { user } = useAppSelector(
    (state: RootState) => state.auth,
  ) as AuthState;
  return (
    <div className="flex flex-col gap-4 shadow-sm p-4 rounded-lg max-w-2xl mx-auto">
      <div className="flex flex-row items-center justify-between border-b gap-4">
        <span>Name</span>
        <span>
          {user?.first_name} {user?.last_name}
        </span>
      </div>
      <div className="flex flex-row items-center justify-between border-b gap-4">
        <span>Email</span>
        <span>{user?.email}</span>
      </div>
      <div className="flex flex-row items-center justify-between border-b gap-4">
        <span>Phone</span>
        <span>{user?.phone}</span>
      </div>
      <div className="flex flex-row items-center justify-between gap-4">
        <span>Account Type</span>
        <span>{user?.role.toUpperCase()}</span>
      </div>
    </div>
  );
}
