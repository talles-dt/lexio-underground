// app/api/stripe/webhook/route.ts
// Stripe webhook handler for checkout.session.completed
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  if (!sig || !process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: "Missing signature or key" }, { status: 400 });
  }

  try {
    const stripe = (await import("stripe")).default;
    const stripeClient = new stripe(process.env.STRIPE_SECRET_KEY);

    // Verify webhook signature if endpoint secret is configured
    let event;
    if (process.env.STRIPE_WEBHOOK_SECRET) {
      event = stripeClient.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } else {
      // For initial testing without webhook secret
      event = JSON.parse(body);
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const userId = session.metadata?.user_id;
      const tier = session.metadata?.tier;

      if (userId && tier) {
        const db = getSupabaseAdmin();

        // Record the purchase
        await db.from("purchases").upsert({
          user_id: userId,
          tier,
          stripe_session_id: session.id,
          stripe_customer_id: session.customer,
          amount_total: session.amount_total,
          currency: session.currency || "brl",
          status: "completed",
          completed_at: new Date().toISOString(),
        }, { onConflict: "stripe_session_id" });

        // Update user tier
        await db.from("users").update({
          tier,
          stripe_customer_id: session.customer,
          updated_at: new Date().toISOString(),
        }).eq("id", userId);
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Stripe webhook error:", err);
    return NextResponse.json({ error: "Webhook failed" }, { status: 400 });
  }
}
