import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { Header } from "@/components/header";
import React from "react";
import { instanceUrl } from "@/lib/utils";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  metadataBase: new URL(instanceUrl()),
  title: "moody",
  description: "Your personal mental health diary",
  icons: {
    icon: "/favicon/favicon.ico",
    shortcut: "/favicon/android-chrome-192x192.png",
    apple: "/favicon/apple-touch-icon.png",
  },
  manifest: `/favicon/site.webmanifest`,
  authors: [
    {
      name: "Tobias Waslowski",
      url: "https://twaslowski.com",
    },
  ],
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex flex-col h-screen">
            <div className="border-b border-b-muted-foreground/10 flex-shrink-0">
              <Header />
            </div>
            <Toaster />
            <main className="flex-1 overflow-auto">{children}</main>
          </div>
        </ThemeProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
