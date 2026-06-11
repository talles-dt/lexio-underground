// app/auth/callback/route.ts
// Handles OAuth callbacks (Google, Apple) and email confirmation links
// Exchanges the `code` param from the URL for a Supabase session,
// then sets the auth cookies and redirects.
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  // If a `next` param is provided (e.g. from a deep link), redirect there after login
  const next = searchParams.get("next") || "/";
  // Detect the OAuth provider from the URL hash or fallback — Supabase passes
  // provider info in the search params for some flows.
  const provider = searchParams.get("provider") || undefined;

  if (code) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Exchange the code returned by the OAuth provider for a session
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.session) {
      // Persist the session in cookies so the client-side Supabase instance
      // picks it up on the next render. We set the same cookies that
      // @supabase/auth-helpers-nextjs expects:
      //   - sb-<ref>-auth-token
      const cookieStore = await cookies();
      const sessionStr = JSON.stringify(data.session);

      // Derive cookie name from the Supabase URL project ref
      let projectRef = "";
      try {
        const urlObj = new URL(supabaseUrl);
        projectRef = urlObj.hostname.split(".")[0];
      } catch {
        projectRef = "localhost";
      }

      const cookieName = `sb-${projectRef}-auth-token`;

      cookieStore.set(cookieName, sessionStr, {
        path: "/",
        httpOnly: false, // client Supabase needs to read it
        sameSite: "lax",
        secure: request.url.startsWith("https"),
        maxAge: 60 * 60 * 24 * 365, // 1 year — matches Supabase default
      });

      return NextResponse.redirect(`${origin}${next}`);
    }

    // Log the error for debugging
    console.error(
      `[auth/callback] Code exchange failed:`,
      error?.message,
      provider ? `(provider: ${provider})` : ""
    );
  }

  // If there's no code or the exchange failed, redirect to sign-in with error
  return NextResponse.redirect(`${origin}/signin?error=auth_failed`);
}
