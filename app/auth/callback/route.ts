import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { authDestination } from '@/pilot/auth-navigation';
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const response = NextResponse.redirect(new URL(authDestination(url.searchParams.get('next')),url.origin));
  response.headers.set('Cache-Control','private, no-store');
  response.headers.set('Referrer-Policy','no-referrer');
  const failure = () => {
    const failed=NextResponse.redirect(new URL('/signin?error=auth',url.origin));
    failed.headers.set('Cache-Control','private, no-store');
    failed.headers.set('Referrer-Policy','no-referrer');
    return failed;
  };
  if (!code) return failure();
  const client=createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,{cookies:{
    getAll:()=>request.cookies.getAll(),
    setAll:(cookies)=>cookies.forEach(({name,value,options})=>response.cookies.set(name,value,options)),
  }});
  const {error}=await client.auth.exchangeCodeForSession(code);
  return error ? failure() : response;
}
