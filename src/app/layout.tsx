import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VB Connect",
  description: "Casual volleyball gatherings in Hillsboro, Oregon",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "VB Connect",
  },
};

export const viewport: Viewport = {
  themeColor: "#4f46e5",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

import { PageTransition } from "@/components/PageTransition";
import { AuthModalProvider } from "@/context/AuthModalContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-50">
        <AuthModalProvider>
          <Navbar />
          <main className="flex-1 pb-24 md:pt-24 md:pb-8">
            <div className="max-w-md mx-auto px-4 md:max-w-4xl">
              <PageTransition>
                {children}
              </PageTransition>
            </div>
          </main>
        </AuthModalProvider>
      </body>
    </html>
  );
}
