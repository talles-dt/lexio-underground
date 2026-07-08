// app/api/checkout/route.ts
// Stripe checkout session creation
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

// LIVE STRIPE PRODUCTS (from Dashboard)
// Note: Replace priceId with actual price IDs from Stripe
const PRODUCTS = {
  "free": {
    id: null,
    priceId: null,
    description: "Free",
    amount: 0,
  },
  "pro-monthly": {
    id: "prod_UHndOopeJuM6Pc",
    priceId: process.env.STRIPE_PRICE_MONTHLY || "price_monthly",
    description: "Mensal",
    amount: 4900, // BRL cents
  },
  "pro-annual": {
    id: "prod_UqIzQNu3Dxylv0",
    priceId: process.env.STRIPE_PRICE_ANNUAL || "price_annual",
    description: "Anual",
    amount: 46800,
  },
  "pro-lifetime": {
    id: "prod_UqJ1XB3pKkSXVB",
    priceId: process.env.STRIPE_PRICE_LIFETIME || "price_lifetime",
    description: "Vitalício (Founders)",
    amount: 149000,
  },
  "family": {
    id: "prod_UqJ2qNCxWZ9w4N",
    priceId: process.env.STRIPE_PRICE_FAMILY || "price_family",
    description: "Família",
    amount: 0, // To be confirmed
  },
} as const;

export type PriceTier = keyof typeof PRODUCTS;

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
  return createClient(url, key, { auth: { persistSession: false } });
}

export async function POST(req: NextRequest) {
  try {
    const { tier, user_id, success_url, cancel_url } = await req.json();

    if (!tier || !PRODUCTS[tier as PriceTier]) {
      return NextResponse.json({ error: "Invalid tier" }, { status: 400 });
    }

    if (!user_id) {
      return NextResponse.json({ error: "user_id required" }, { status: 400 });
    }

    const product = PRODUCTS[tier as PriceTier];

    // If Stripe keys not configured, return mock checkout URL
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({
        url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/checkout/mock?tier=${tier}&user_id=${user_id}`,
        mock: true,
      });
    }

    const stripe = (await import("stripe")).default;
    const stripeClient = new stripe(process.env.STRIPE_SECRET_KEY as string);

    // Get user and customer ID
    const supabase = getSupabaseAdmin();
    const { data: user } = await supabase
      .from("users")
      .select("email, name, stripe_customer_id")
      .eq("id", user_id)
      .single();

    let customerId = user?.stripe_customer_id;

    // Create customer if needed
    if (!customerId) {
      const customer = await stripeClient.customers.create({
        email: user?.email || "",
        name: user?.name || "",
        metadata: { user_id },
      });
      customerId = customer.id;

      await supabase
        .from("users")
        .update({ stripe_customer_id: customerId })
        .eq("id", user_id);
    }

    const session = await stripeClient.checkout.sessions.create({
      customer: customerId,
      mode: tier === "lifetime" || tier === "family" ? "payment" : "subscription",
      line_items: [
        {
          price_data: {
            currency: "brl",
            product_data: {
              name: `Lexio Underground - ${product.description}`,
              description:
                tier === "lifetime" || tier === "family"
                  ? `Acesso ${product.description.toLowerCase()}`
                  : `Assinatura ${product.description.toLowerCase()}`,
            },
            unit_amount: product.amount,
            recurring:
              tier === "lifetime" || tier === "family" ? undefined : { interval: tier === "annual" ? "year" : "month" },
          },
          quantity: 1,
        },
      ],
      success_url:
        success_url ||
        `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/palace?checkout=success`,
      cancel_url:
        cancel_url ||
        `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/pricing?checkout=cancel`,
      metadata: { user_id, tier },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Checkout error:", err);
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}