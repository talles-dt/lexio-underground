"use client";

import { AuthProvider } from "@/lib/auth";
import { TamaguiProvider } from "@tamagui/core";
import tamaguiConfig from "../tamagui.config";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { I18nextProvider } from "react-i18next";
import { BottomNav } from "@/components/BottomNav";
import { NotificationProvider } from "@/components/NotificationProvider";
import React, { ReactNode } from "react";

const queryClient = new QueryClient();

const i18n = {
  t: (key: string) => key,
} as any;

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <TamaguiProvider config={tamaguiConfig} defaultTheme="dark">
      <QueryClientProvider client={queryClient}>
        <I18nextProvider i18n={i18n}>
          <AuthProvider>
            <NotificationProvider>
              {children}
              <BottomNav />
            </NotificationProvider>
          </AuthProvider>
        </I18nextProvider>
        <ReactQueryDevtools />
      </QueryClientProvider>
    </TamaguiProvider>
  );
}
