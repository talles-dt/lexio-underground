import React from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useRouter, useSearchParams } from "expo-router";
import { supabase } from '../../src/lib/supabase';

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
