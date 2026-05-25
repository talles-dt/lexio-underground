"use client";

import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useTheme } from "@/theme/ThemeProvider";

const productId =
  process.env.NEXT_PUBLIC_STRIPE_PRODUCT_ID ??
  process.env.EXPO_PUBLIC_STRIPE_PRODUCT_ID;

const CheckoutScreen = () => {
  const router = useRouter();
  const theme = useTheme();

  const handleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/(auth)/callback`,
      },
    });
    if (error) console.error("OAuth error:", error);
  };

  const handleBuyStripe = () => {
    const url = `https://buy.stripe.com/test_${productId}`;
    window.open(url, "_blank");
  };

  return (
    <div
      style={{
        flex: 1,
        justifyContent: "center",
        padding: 20,
        backgroundColor: theme.colors.surface,
        color: theme.colors.ivory,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <p
        style={{
          fontSize: 18,
          marginBottom: 20,
          textAlign: "center",
          maxWidth: "400px",
        }}
      >
        Please join the waitlist. We'll notify you when Lexio Underground is
        ready.
      </p>
      <button
        onClick={handleSignIn}
        style={{
          marginBottom: 12,
          padding: "12px 24px",
          backgroundColor: theme.colors.ivory,
          color: theme.colors.obsidian,
          border: "none",
          borderRadius: theme.radius.btn,
          cursor: "pointer",
          fontSize: 16,
          minWidth: "120px",
        }}
      >
        Sign in
      </button>
      <button
        onClick={handleBuyStripe}
        style={{
          marginBottom: 12,
          padding: "12px 24px",
          backgroundColor: theme.colors.amber,
          color: theme.colors.obsidian,
          border: "none",
          borderRadius: theme.radius.btn,
          cursor: "pointer",
          fontSize: 16,
          minWidth: "120px",
        }}
      >
        Buy via Stripe
      </button>
      <button
        onClick={() => router.back()}
        style={{
          padding: "12px 24px",
          backgroundColor: theme.colors.zinc,
          color: theme.colors.ivory,
          border: "none",
          borderRadius: theme.radius.btn,
          cursor: "pointer",
          fontSize: 16,
          minWidth: "120px",
        }}
      >
        Back
      </button>
    </div>
  );
};

export default CheckoutScreen;
