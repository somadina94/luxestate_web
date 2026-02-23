"use client";
import { useAppSelector, RootState, AuthState } from "@/store";

import { MessageCircle, Bell, User, ChevronDown } from "lucide-react";

export default function DashboardHeader() {
  const { user } = useAppSelector(
    (state: RootState) => state.auth,
  ) as AuthState;

  return (
    <header className="text-center flex flex-row justify-end px-4 border-b h-30 sticky top-0 z-10 bg-background/90">
      <div className="flex flex-row justify-center gap-4 items-center max-w-48 w-full border-r">
        <div className=" w-8 h-8 md:w-14 md:h-14 rounded-2xl bg-muted flex justify-center items-center relative">
          <MessageCircle className="text-primary w-3 h-3 md:w-5 md:h-5" />
          <p className="min-w-3 min-h-3 md:min-w-6 md:min-h-6  bg-destructive rounded-full text-white flex justify-center items-center text-[8px] md:text-sm absolute top-1 right-1">
            22
          </p>
        </div>
        <div className=" w-8 h-8 md:w-14 md:h-14 rounded-2xl bg-muted flex justify-center items-center relative">
          <Bell size={24} className="text-primary w-3 h-3 md:w-5 md:h-5" />
          <p className="min-w-3 min-h-3 md:min-w-6 md:min-h-6  bg-destructive rounded-full text-white flex justify-center items-center text-[8px] md:text-sm absolute top-1 right-1">
            22
          </p>
        </div>
      </div>
      <div className="flex flex-row justify-between items-center p-4">
        <div className="flex flex-row justify-between items-center gap-4">
          <div className="flex flex-col items-end">
            <span className="font-semibold text-[10px] md:text-[16px] block">{`${user?.first_name} ${user?.last_name[0]}`}</span>
            <span className="text-sm">{user?.role}</span>
          </div>
          <div className="w-6 h-6 md:w-14 md:h-14 rounded-lg bg-muted-foreground flex justify-center items-center">
            <User className="text-primary w-3 h-3 md:w-5 md:h-5" />
          </div>
          <div className="flex flex-row justify-center items-center gap-2 bg-muted p-2 rounded-md">
            <span className="text-sm md:text-lg">EN</span>
            <ChevronDown className="w-3 h-3 md:w-5 md:h-5" />
          </div>
        </div>
      </div>
    </header>
  );
}
