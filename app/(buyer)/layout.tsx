import type { Metadata } from "next";
import "../globals.css";
import { ThemeProvider } from "@/context/theme-provider";
import ReduxProvider from "@/context/redux-provider";

export const metadata: Metadata = {
  title: "Buyer Dashboard",
  description: "Buyer Dashboard for Luxestate",
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
        <main>{children}</main>
      </ReduxProvider>
    </ThemeProvider>
  );
}
