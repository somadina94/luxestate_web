import {
  LayoutDashboard,
  HouseIcon,
  UserStar,
  StarIcon,
  MessageCircleIcon,
  SettingsIcon,
  BellIcon,
  TicketIcon,
  PlusIcon,
  SubscriptIcon,
} from "lucide-react";
import PropertyIcon from "@/components/atoms/PropertyIcon";

export interface MenuItem {
  title: string;
  url: string;
  icon: React.ElementType;
}

export const ADMIN_MENU_ITEMS: MenuItem[] = [
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
    title: "Messages",
    url: "/admin-dashboard/messages",
    icon: MessageCircleIcon,
  },
  {
    title: "Notifications",
    url: "/admin-dashboard/notifications",
    icon: BellIcon,
  },
  {
    title: "Tickets",
    url: "/admin-dashboard/tickets",
    icon: TicketIcon,
  },
  {
    title: "Subscriptions",
    url: "/admin-dashboard/subscriptions",
    icon: SubscriptIcon,
  },
];

export const BUYER_MENU_ITEMS: MenuItem[] = [
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
    title: "Notifications",
    url: "/buyer-dashboard/notifications",
    icon: BellIcon,
  },
  {
    title: "Tickets",
    url: "/buyer-dashboard/tickets",
    icon: TicketIcon,
  },
  {
    title: "Settings",
    url: "/buyer-dashboard/settings",
    icon: SettingsIcon,
  },
];

export const SELLER_MENU_ITEMS: MenuItem[] = [
  {
    title: "Properties",
    url: "/seller-dashboard/properties",
    icon: PropertyIcon,
  },
  {
    title: "Add Property",
    url: "/seller-dashboard/add-property",
    icon: PlusIcon,
  },
  {
    title: "Messages",
    url: "/seller-dashboard/messages",
    icon: MessageCircleIcon,
  },
  {
    title: "Notifications",
    url: "/seller-dashboard/notifications",
    icon: BellIcon,
  },
  {
    title: "Tickets",
    url: "/seller-dashboard/tickets",
    icon: TicketIcon,
  },
  {
    title: "Settings",
    url: "/seller-dashboard/settings",
    icon: SettingsIcon,
  },
];
