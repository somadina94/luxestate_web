"use client";
import { useState, useEffect, useMemo } from "react";
import UserItem from "../organisms/user-item";
import { authService } from "@/services";
import { User } from "@/types";
import { useAppSelector, RootState, AuthState } from "@/store";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type RoleFilter = "all" | "admin" | "buyer" | "seller";

export default function AdminUserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
  const { access_token } = useAppSelector(
    (state: RootState) => state.auth,
  ) as AuthState;

  useEffect(() => {
    const fetchData = async () => {
      const res = await authService.getAllUsers(access_token as string);
      if (res.status === 200) {
        setUsers(res.data);
      } else {
        toast.error(res.message);
      }
    };
    fetchData();
  }, [access_token]);

  const filteredUsers = useMemo(() => {
    if (roleFilter === "all") {
      return users;
    }
    return users.filter(
      (user) => user.role.toLowerCase() === roleFilter.toLowerCase(),
    );
  }, [users, roleFilter]);

  const filterOptions: { value: RoleFilter; label: string }[] = [
    { value: "all", label: "All Users" },
    { value: "admin", label: "Admin" },
    { value: "buyer", label: "Buyer" },
    { value: "seller", label: "Seller" },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Filter Section */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-muted-foreground">
          Filter by role:
        </span>
        <div className="flex flex-wrap gap-2">
          {filterOptions.map((option) => (
            <Button
              key={option.value}
              variant={roleFilter === option.value ? "default" : "outline"}
              size="sm"
              onClick={() => setRoleFilter(option.value)}
              className={cn(
                "transition-all",
                roleFilter === option.value &&
                  "shadow-sm ring-2 ring-primary/20",
              )}
            >
              {option.label}
            </Button>
          ))}
        </div>
        {roleFilter !== "all" && (
          <span className="text-sm text-muted-foreground ml-auto">
            Showing {filteredUsers.length} of {users.length} users
          </span>
        )}
      </div>

      {/* Users List */}
      <div className="flex flex-col gap-4">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <UserItem key={user.id} user={user} />
          ))
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No users found with the selected role.
          </div>
        )}
      </div>
    </div>
  );
}
