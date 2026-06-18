"use client";

import { AuthProvider } from "@/lib/auth";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { BottomNav } from "@/components/BottomNav";
import { NotificationProvider } from "@/components/NotificationProvider";
import React, { ReactNode } from "react";

const queryClient = new QueryClient();

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <NotificationProvider>
          {children}
        </NotificationProvider>
        <BottomNav />
      </AuthProvider>
    </QueryClientProvider>
  );
}
