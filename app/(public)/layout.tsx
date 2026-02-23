import type { Metadata } from "next";
import "../globals.css";
import { ThemeProvider } from "@/context/theme-provider";
import ReduxProvider from "@/context/redux-provider";
import { Toaster } from "sonner";
import Footer from "@/components/organisms/footer";

export const metadata: Metadata = {
  title: "Luxestate",
  description: "Luxestate is a platform for buying and selling properties",
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
        <main>
          {children}
          <Toaster />
          <Footer />
        </main>
      </ReduxProvider>
    </ThemeProvider>
  );
}
