// app/api/checkout/route.ts
// Stripe checkout session creation (Phase 5.4)
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Pricing from spec: monthly (R$ 49), annual (R$ 468), lifetime (R$ 1,490)
const PRICES = {
  monthly: { amount: 4900, description: "Mensal" },
  annual: { amount: 46800, description: "Anual" },
  lifetime: { amount: 149000, description: "Vitalício" },
} as const;

export type PriceTier = keyof typeof PRICES;

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
  return createClient(url, key, { auth: { persistSession: false } });
}

export async function POST(req: NextRequest) {
  try {
    const { tier, user_id, success_url, cancel_url } = await req.json();

    if (!tier || !PRICES[tier as PriceTier]) {
      return NextResponse.json({ error: "Invalid tier" }, { status: 400 });
    }

    if (!user_id) {
      return NextResponse.json({ error: "user_id required" }, { status: 400 });
    }

    const price = PRICES[tier as PriceTier];

    // If Stripe keys not configured, return mock checkout URL
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({
        url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/checkout/mock?tier=${tier}&user_id=${user_id}`,
        mock: true,
      });
    }

    const stripe = (await import("stripe")).default;
    const stripeClient = new stripe(process.env.STRIPE_SECRET_KEY as string);

    const supabase = getSupabaseAdmin();

    // Get or create customer
    const { data: user } = await supabase
      .from("users")
      .select("email, name, stripe_customer_id")
      .eq("id", user_id)
      .single();

    let customerId = user?.stripe_customer_id;

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
      mode: tier === "lifetime" ? "payment" : "subscription",
      line_items: [
        {
          price_data: {
            currency: "brl",
            product_data: {
              name: `Lexio Underground - ${price.description}`,
              description:
                tier === "lifetime"
                  ? "Acesso vitalício"
                  : `Assinatura ${price.description.toLowerCase()}`,
            },
            unit_amount: price.amount,
            recurring:
              tier === "lifetime"
                ? undefined
                : { interval: tier === "annual" ? "year" : "month" },
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
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
