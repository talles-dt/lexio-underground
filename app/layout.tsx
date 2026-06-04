import React from "react";
import { colors } from "@/theme/tokens";
import Providers from "@/providers";

import { type Viewport } from "next";

export const viewport: Viewport = {
  themeColor: "#0D0D0F",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export const metadata = {
  title: "Lexio Underground",
  description: "Map your ignorance. Master your language.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Lexio Underground",
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
