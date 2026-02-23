"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { BUYER_MENU_ITEMS } from "@/constants/menu-items";
import Link from "next/link";
import Image from "next/image";
import logoDark from "@/assets/logo.png";
import logoLight from "@/assets/logo-light.png";

import { useTheme } from "next-themes";
import { LightDarkToggle } from "../atoms/light-dark-toggle";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { usePathname } from "next/navigation";
import { useLogout } from "@/hooks/use-logout";

export default function BuyerSidebar() {
  const theme = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const logout = useLogout();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="flex flex-row items-center gap-4 border-b w-full h-30">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Image
                src={theme.theme === "light" ? logoLight : logoDark}
                alt="logo"
                className="w-full h-full"
              />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {BUYER_MENU_ITEMS.map((item) => {
            const isActive = pathname === item.url;
            return (
              <SidebarMenuItem
                key={item.title}
                className="border-b cursor-pointer"
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
