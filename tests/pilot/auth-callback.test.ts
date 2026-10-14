import { readFileSync } from 'node:fs';
import { transformSync } from '@babel/core';
import { NextRequest, NextResponse } from 'next/server';
import * as navigation from '../../src/pilot/auth-navigation';
const exchange=jest.fn();
const compiled=transformSync(readFileSync('app/auth/callback/route.ts','utf8'),{filename:'route.ts',configFile:false,babelrc:false,presets:[['@babel/preset-env',{targets:{node:'current'}}],'@babel/preset-typescript']})!.code!;
const route={exports:{} as {GET:(request:NextRequest)=>Promise<NextResponse>}};
new Function('require','module','exports',compiled)((name:string)=>{
 if(name==='next/server')return {NextResponse};
 if(name==='@supabase/ssr')return {createServerClient:()=>({auth:{exchangeCodeForSession:exchange}})};
 if(name==='@/pilot/auth-navigation')return navigation;
 throw new Error(name);
},route,route.exports);
beforeEach(()=>exchange.mockReset());
test('successful code opens workspace and is not cached',async()=>{
 exchange.mockResolvedValue({error:null});const r=await route.exports.GET(new NextRequest('https://lexio.test/auth/callback?code=test'));
 expect(r.headers.get('location')).toBe('https://lexio.test/learn');expect(r.headers.get('cache-control')).toContain('no-store');
});
test.each(['returned','thrown'])('failed session exchange (%s) does not claim email was rejected',async mode=>{
 if(mode==='returned')exchange.mockResolvedValue({error:{message:'invalid verifier'}});else exchange.mockRejectedValue(new Error('missing verifier'));
 const r=await route.exports.GET(new NextRequest('https://lexio.test/auth/callback?code=test'));
 expect(r.headers.get('location')).toBe('https://lexio.test/signin?error=session');
 expect(navigation.authErrorMessage('session')).toContain('e-mail e senha');
});
test('failed recovery keeps recovery-specific guidance',async()=>{
 exchange.mockRejectedValue(new Error('missing verifier'));
 const r=await route.exports.GET(new NextRequest('https://lexio.test/auth/callback?code=test&next=/auth/reset'));
 expect(r.headers.get('location')).toBe('https://lexio.test/signin?error=recovery');
});
test('missing code cannot claim success or call auth exchange',async()=>{
 const r=await route.exports.GET(new NextRequest('https://lexio.test/auth/callback'));
 expect(r.headers.get('location')).toBe('https://lexio.test/signin?error=auth');expect(exchange).not.toHaveBeenCalled();
});
