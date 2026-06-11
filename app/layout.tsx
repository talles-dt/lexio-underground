import React from "react";
import "@/styles/globals.css";
import { colors } from "@/theme/tokens";
import Providers from "@/providers";

import type { Metadata, Viewport } from "next";

export const viewport: Viewport = {
  themeColor: "#0D0D0F",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "Lexio Underground",
  description: "Map your ignorance. Master your language.",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/assets/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Lexio Underground",
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body
        style={{
          backgroundColor: colors.obsidian,
          color: colors.ivory,
          margin: 0,
          minHeight: "100dvh",
        }}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
