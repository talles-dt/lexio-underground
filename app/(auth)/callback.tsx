import React from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useSearchParams } from "next/navigation";
import { supabase } from '@/lib/supabase';

export default function Callback() {
  const router = useRouter();
  const params = useSearchParams();

  React.useEffect(() => {
    if (params?.error) {
      console.error("OAuth error:", params.error);
      return;
    }
    if (params?.code) {
      supabase.auth
        .exchangeCodeForSession(params.code as string)
        .then(({ error }) => {
          if (error) console.error("Session exchange error:", error);
          else router.replace("/");
        });
    }
  }, [params]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" />
    </View>
  );
}
