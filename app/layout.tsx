import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeContext";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "ParkAddis - Modern Parking Solutions",
  description: "Find and book parking spots in Addis Ababa with ease.",
};

import { AppSessionProvider } from "@/components/session/AppSessionProvider";
import { UIProvider } from "@/components/ui/UIProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} font-sans antialiased text-foreground bg-background`}>
        <ThemeProvider>
          <UIProvider>
            <AppSessionProvider>
              {children}
            </AppSessionProvider>
          </UIProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
