import { LayoutDashboard, HouseIcon, UserStar } from "lucide-react";
import PropertyIcon from "@/components/atoms/PropertyIcon";

export const ADMIN_MENU_ITEMS = [
  {
    title: "Dashboard",
    url: "/admin-dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Properties",
    url: "/admin-dashboard/properties",
    icon: PropertyIcon,
  },
  {
    title: "Users",
    url: "/admin-dashboard/users",
    icon: UserStar,
  },
  {
    title: "Home",
    url: "/",
    icon: HouseIcon,
  },
];
