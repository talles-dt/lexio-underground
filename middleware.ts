import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { legacyApiStatus } from "./src/pilot/api-policy";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const blocked = legacyApiStatus(path);
  if (blocked) return NextResponse.json({ error: blocked === 410 ? "Integração removida." : "Recurso ainda não liberado neste piloto." }, { status: blocked, headers: { 'Cache-Control': 'no-store' } });
  if (path === '/api/health') return NextResponse.next();
  const accountsEnabled = process.env.NEXT_PUBLIC_PILOT_ACCOUNTS_ENABLED === 'true';
  if (!accountsEnabled) {
    if (path.startsWith('/api/') || path.startsWith('/admin')) return NextResponse.json({ error: 'Contas e administração não liberadas neste piloto.' }, { status: 503 });
    if (path === '/signin' || path === '/profile' || path.startsWith('/auth/')) return NextResponse.redirect(new URL('/learn', request.url));
    return NextResponse.next();
  }
  const admin = path === '/admin' || path.startsWith('/admin/') || path.startsWith('/api/admin/');
  let response = NextResponse.next({ request });
  response.headers.set('Cache-Control', 'private, no-store');
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return admin ? NextResponse.json({ error: 'Serviço não configurado.' }, { status: 503 }) : response;
  const supabase = createServerClient(url, key, { cookies: {
    getAll: () => request.cookies.getAll(),
    setAll: (cookies) => {
      cookies.forEach(({ name, value }) => request.cookies.set(name, value));
      response = NextResponse.next({ request });
      response.headers.set('Cache-Control', 'private, no-store');
      cookies.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
    },
  }});
  // Verify identity at the authentication server, not from user-editable claims.
  const bearer = request.headers.get('authorization')?.match(/^Bearer (.+)$/)?.[1];
  const { data: { user }, error } = await supabase.auth.getUser(bearer);
  if (!admin) return response;
  if (error || !user) return NextResponse.json({ error: 'Autenticação necessária.' }, { status: 401 });
  const { data: profile } = await supabase.from('users').select('role').eq('id', user.id).maybeSingle();
  if (!profile || !['admin','super_admin'].includes(profile.role)) return NextResponse.json({ error: 'Acesso negado.' }, { status: 403 });
  return response;
}
export const config = { matcher: ['/admin/:path*', '/api/:path*', '/learn/:path*', '/signin', '/profile', '/auth/:path*', '/phonos', '/syntaxis', '/palace', '/pulse', '/conversation-shadow'] };
