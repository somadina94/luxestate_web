import type { Metadata } from "next";
import "../globals.css";
import { ThemeProvider } from "@/context/theme-provider";
import ReduxProvider from "@/context/redux-provider";
import SidebarComponent from "@/components/molecules/sidebar";
import DashboardHeader from "@/components/molecules/dashboard-header";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export const metadata: Metadata = {
  title: "Seller Dashboard",
  description: "Seller Dashboard for Luxestate",
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
          <SidebarComponent />
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
