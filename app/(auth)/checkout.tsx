"use strict";
import { StripeProvider, useStripe } from '@stripe/stripe-react-native';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'expo-router';
import { Button, Text, View } from 'react-native';

export default function CheckoutScreen() {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const router = useRouter();

  const initializePayment = async () => {
    // 1. Fetch Stripe payment intent from our API
    const { data: { session } } = await supabase.auth.getSession();
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/checkout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session?.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ priceId: "price_1TVmU3DytXLV2apOoJHS7A7b" }),
    });
    const { paymentIntent, ephemeralKey, customer } = await response.json();

    // 2. Initialize Stripe Payment Sheet
    const { error } = await initPaymentSheet({
      merchantDisplayName: "Lexio Underground",
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntent,
      returnURL: "lexio://checkout",
    });
    if (error) {
      alert(`Error: ${error.message}`);
      return;
    }

    // 3. Present Payment Sheet
    const { error: presentError } = await presentPaymentSheet();
    if (presentError) {
      alert(`Error: ${presentError.message}`);
    } else {
      // Redirect to callback with license key (simulated here; real app uses Stripe webhook)
      const licenseKey = `lexio-found-${Math.random().toString(36).substring(2, 10)}`;
      router.replace(`/auth/callback?license=${licenseKey}`);
    }
  };

  return (
    <StripeProvider publishableKey={process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!}>
      <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
        <Text style={{ fontSize: 18, marginBottom: 20 }}>Become a Lexio Underground Founder</Text>
        <Text style={{ marginBottom: 20 }}>• Lifetime Pro access (no monthly fees)</Text>
        <Text style={{ marginBottom: 20 }}>• All future languages at launch</Text>
        <Text style={{ marginBottom: 20 }}>• Early access to new features</Text>
        <Button title="Unlock for R$1,499" onPress={initializePayment} />
      </View>
    </StripeProvider>
  );
}