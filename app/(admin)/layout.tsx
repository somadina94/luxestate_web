import type { Metadata } from "next";
import "../globals.css";
import { ThemeProvider } from "@/context/theme-provider";
import ReduxProvider from "@/context/redux-provider";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import AdminSidebar from "@/components/molecules/admin-sidebar";
import DashboardHeader from "@/components/molecules/dashboard-header";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Admin Dashboard for Luxestate",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <ReduxProvider>
        <DashboardHeader />
        <SidebarProvider>
          <AdminSidebar />
          <SidebarInset />
          <main className="w-full">
            <SidebarTrigger />
            {children}
          </main>
        </SidebarProvider>
      </ReduxProvider>
    </ThemeProvider>
  );
}
