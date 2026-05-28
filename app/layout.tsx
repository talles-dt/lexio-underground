import React from "react";
import { colors } from "@/theme/tokens";

export const metadata = {
  title: "Lexio Underground",
  description: "Map your ignorance. Master your language.",
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
        {children}
      </body>
    </html>
  );
}
