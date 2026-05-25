import React from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from '@/lib/supabase';

export default function Callback() {
  const router = useRouter();
  const params = useSearchParams();

  React.useEffect(() => {
    const error = params.get('error');
    if (error) {
      console.error("OAuth error:", error);
      return;
    }
    const code = params.get('code');
    if (code) {
      supabase.auth
        .exchangeCodeForSession(code)
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