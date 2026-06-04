import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  const { license_key } = await req.json();
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  // 1. Validate license
  const { data, error } = await supabase
    .from("founders")
    .select("*")
    .eq("license_key", license_key)
    .single();

  if (error || !data) {
    return new Response(JSON.stringify({ error: "Invalid license" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // 2. Update user
  const { error: updateError } = await supabase
    .from("users")
    .update({ is_founder: true })
    .eq("id", data.user_id);

  if (updateError) {
    return new Response(JSON.stringify({ error: updateError.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});
