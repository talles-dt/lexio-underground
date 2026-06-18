import { NextRequest, NextResponse } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const rawNext = requestUrl.searchParams.get("next") || "/";

  // Prevent open redirect: only allow relative paths
  const next = rawNext.startsWith("/") && !rawNext.startsWith("//")
    ? rawNext
    : "/";

  if (code) {
    // Create a response we can modify
    const response = NextResponse.redirect(new URL(next, requestUrl.origin));

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            // Set cookie on BOTH the request (for exchangeCodeForSession)
            // and the response (for the browser)
            request.cookies.set({ name, value, ...options });
            response.cookies.set({ name, value, ...options });
          },
          remove(name: string, options: CookieOptions) {
            request.cookies.set({ name, value: "", ...options });
            response.cookies.set({ name, value: "", ...options });
          },
        },
      }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      console.error("Auth callback error:", error.message);
      return NextResponse.redirect(new URL("/signin?error=auth", requestUrl.origin));
    }

    // Return the response with session cookies set
    return response;
  }

  return NextResponse.redirect(new URL(next, requestUrl.origin));
}
