"use client";
import { useState } from "react";
import { useAppSelector, RootState, AuthState } from "@/store";
import SettingsItem from "../organisms/settings-item";
import { CreditCard, Trash2, User, Lock, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import IconButton from "../atoms/IconButton";
import { toast } from "sonner";
import { authService } from "@/services";
import { useLogout } from "@/hooks/use-logout";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";

export default function Settings() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { user, access_token } = useAppSelector(
    (state: RootState) => state.auth,
  ) as AuthState;
  const logout = useLogout();
  const [isOpen, setIsOpen] = useState(false);
  const handleDeleteAccount = async () => {
    setLoading(true);
    const response = await authService.deactivateUser(access_token as string);
    if (response.status === 200) {
      toast.success("Account deleted successfully");
      logout();
      router.push("/");
    } else {
      toast.error(response.message as string);
    }
    setLoading(false);
  };
  return (
    <div className="flex flex-col gap-4 mx-auto max-w-2xl">
      <SettingsItem
        title="My Details"
        description="Manage your profile"
        Icon={User}
        onClick={() => {
          router.push(`/${user?.role}-dashboard/settings/my-details`);
        }}
      />
      <SettingsItem
        title="Update Password"
        description="Manage your password"
        Icon={Lock}
        onClick={() => {
          router.push(`/${user?.role}-dashboard/settings/update-password`);
        }}
      />
      {user?.role === "seller" && (
        <SettingsItem
          title="Subscription"
          description="Manage your subscription"
          Icon={CreditCard}
          onClick={() => {
            router.push(`${user?.role}-dashboard/settings/subscription`);
          }}
        />
      )}
      <AlertDialog>
        <AlertDialogTrigger asChild className="cursor-pointer">
          <IconButton
            variant="destructive"
            Icon={Trash}
            title="Delete profile"
            type="button"
            isLoading={loading}
          />
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are your absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you absolutely sure you want to delete your account? All
              information you have with us will be deletd and there is no
              recovery option.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button asChild onClick={handleDeleteAccount} variant="destructive">
              <AlertDialogAction>Continue</AlertDialogAction>
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
