import {
  LayoutDashboard,
  HouseIcon,
  UserStar,
  StarIcon,
  MessageCircleIcon,
  SettingsIcon,
} from "lucide-react";
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

export const BUYER_MENU_ITEMS = [
  {
    title: "Properties",
    url: "/buyer-dashboard/properties",
    icon: PropertyIcon,
  },
  {
    title: "Favorites",
    url: "/buyer-dashboard/favorites",
    icon: StarIcon,
  },
  {
    title: "Messages",
    url: "/buyer-dashboard/messages",
    icon: MessageCircleIcon,
  },
  {
    title: "Settings",
    url: "/buyer-dashboard/settings",
    icon: SettingsIcon,
  },
  {
    title: "Home",
    url: "/",
    icon: HouseIcon,
  },
];
