import type { Metadata } from "next";
import { EB_Garamond, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ServiceWorkerRegistration } from "@/components/ServiceWorkerRegistration";

const ebGaramond = EB_Garamond({
  variable: "--font-eb-garamond",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lore",
  description: "Wikipedia as a Social Experience",
  manifest: "/manifest.json",
};

import { CSPostHogProvider } from "@/components/providers/PostHogProvider";
import SuspendedPostHogPageView from "@/components/providers/PostHogPageView";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${ebGaramond.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
      data-theme="midnight"
    >
      <CSPostHogProvider>
        <body className="min-h-full flex flex-col font-sans">
          <SuspendedPostHogPageView />
          <ServiceWorkerRegistration />
          {children}
        </body>
      </CSPostHogProvider>
    </html>
  );
}
