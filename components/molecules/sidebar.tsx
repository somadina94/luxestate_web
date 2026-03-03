"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import {
  ADMIN_MENU_ITEMS,
  BUYER_MENU_ITEMS,
  SELLER_MENU_ITEMS,
  MenuItem,
} from "@/constants/menu-items";
import Link from "next/link";
import Image from "next/image";
import logoDark from "@/assets/logo.png";
import logoLight from "@/assets/logo-light.png";
import { useAppSelector, RootState, AuthState } from "@/store";

import { useTheme } from "next-themes";
import { LightDarkToggle } from "../atoms/light-dark-toggle";
import { useRouter } from "next/navigation";
import { HouseIcon, LogOut } from "lucide-react";
import { usePathname } from "next/navigation";
import { useLogout } from "@/hooks/use-logout";
import { useUnreadCount } from "@/hooks/use-unread-count";
import { useUnreadNotificationCount } from "@/hooks/use-unread-notification-count";
import { useOpenTicketCount } from "@/hooks/use-open-ticket-count";

export default function SidebarComponent() {
  const theme = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const logout = useLogout();
  const { user, access_token } = useAppSelector(
    (state: RootState) => state.auth,
  ) as AuthState;
  const { unreadCount } = useUnreadCount(access_token ?? null);
  const { unreadCount: unreadNotificationCount } = useUnreadNotificationCount(
    access_token ?? null,
  );
  const { openCount: openTicketCount } = useOpenTicketCount(
    access_token ?? null,
  );

  let menuItems: MenuItem[] = [] as MenuItem[];
  if (user?.role === "admin") {
    menuItems = ADMIN_MENU_ITEMS;
  } else if (user?.role === "buyer") {
    menuItems = BUYER_MENU_ITEMS;
  } else if (user?.role === "seller") {
    menuItems = SELLER_MENU_ITEMS;
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="flex flex-row items-center gap-4 border-b w-full h-30">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <div className="flex flex-row items-center gap-2">
                <HouseIcon size={24} />
                <Link href="/" className="text-2xl font-bold">
                  LUXESTATE
                </Link>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => {
            const isActive = pathname.includes(item.url);
            const messageCount =
              item.title === "Messages" ? unreadCount : undefined;
            const notificationCount =
              item.title === "Notifications"
                ? unreadNotificationCount
                : undefined;
            const ticketCount =
              item.title === "Tickets" ? openTicketCount : undefined;
            const badgeCount =
              messageCount ?? notificationCount ?? ticketCount ?? 0;
            return (
              <SidebarMenuItem
                key={item.title}
                className="relative border-b cursor-pointer"
              >
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  isActive={isActive}
                >
                  <Link
                    href={item.url}
                    className={`flex items-center gap-2 w-full ${isActive ? "text-primary" : ""}`}
                  >
                    <item.icon
                      className={`${isActive ? "text-primary" : ""}`}
                    />
                    <span className={`${isActive ? "text-primary" : ""}`}>
                      {item.title}
                    </span>
                  </Link>
                </SidebarMenuButton>
                {badgeCount > 0 && (
                  <SidebarMenuBadge className="bg-destructive text-white rounded-full min-w-5 h-5 text-[10px] font-semibold">
                    {badgeCount > 99 ? "99+" : badgeCount}
                  </SidebarMenuBadge>
                )}
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="w-full h-full px-0">
              <div className="flex flex-row justify-between items-center gap-3 w-full">
                <LightDarkToggle />
                <button
                  onClick={() => {
                    router.push("/");
                    logout();
                  }}
                  className="flex flex-col items-center cursor-pointer"
                >
                  <LogOut size={24} color="red" />
                  <span>Sign out</span>
                </button>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
