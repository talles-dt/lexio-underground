import React from "react";
import { useRouter } from "expo-router";
import { View, Text, Image, Linking } from "react-native";
import { Button } from "@/components/ui";
import { supabase } from '../../src/lib/supabase';

const productId = process.env.EXPO_PUBLIC_STRIPE_PRODUCT_ID;

const CheckoutScreen = () => {
  const router = useRouter();
  const theme = useTheme();

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
      <Text style={{ fontSize: 18, marginBottom: 20, textAlign: "center" }}>
        Please join the waitlist. We'll notify you when Lexio Underground is
        ready.
      </Text>
      <Button
        style={{ marginBottom: 20 }}
        onPress={async () => {
          const { error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
              redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/(auth)/callback`,
            },
          });
          if (error) console.error("OAuth error:", error);
        }}
      >
        Sign in
      </Button>
      <Button
        style={{ marginBottom: 20 }}
        onPress={() => {
          Linking.openURL(`https://buy.stripe.com/test_${productId}`).catch(
            console.error,
          );
        }}
      >
        Buy via Stripe
      </Button>
      <Button onPress={() => router.back()}>Back</Button>
    </View>
  );
};

export default CheckoutScreen;
