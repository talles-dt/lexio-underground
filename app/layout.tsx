import React from "react";
import { colors } from "@/theme/tokens";
import Providers from "./providers";

export const metadata = {
  title: "Lexio Underground",
  description: "Map your ignorance. Master your language.",
  manifest: "/manifest.json",
  themeColor: "#0D0D0F",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Lexio Underground",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    viewportFit: "cover",
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
          margin: 0,
          backgroundColor: colors.obsidian,
          color: colors.ivory,
          minHeight: "100vh",
        }}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
