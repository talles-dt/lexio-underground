import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { readFileSync } from 'node:fs';
import { transformSync } from '@babel/core';
import * as authNavigation from '../../src/pilot/auth-navigation';
import * as tokens from '../../src/theme/tokens';
// Render the actual screen; the app's JSX-preserving TS config needs a JSX transform here.
const source=readFileSync('app/signin/page.tsx','utf8');
const compiled=transformSync(source,{filename:'signin.tsx',configFile:false,babelrc:false,presets:[['@babel/preset-env',{targets:{node:'current'}}],'@babel/preset-typescript','@babel/preset-react']})!.code!;
const screen={exports:{} as {default:React.ComponentType}};
new Function('require','module','exports',compiled)((name:string)=>{
 if(name==='react')return React;
 if(name==='@/pilot/auth-navigation')return authNavigation;
 if(name==='@/theme/tokens')return tokens;
 if(name==='next/navigation')return {useRouter:()=>({})};
 if(name==='@/lib/auth')return {supabase:()=>{throw new Error('unexpected auth call during render');}};
 throw new Error(`Unexpected import ${name}`);
},screen,screen.exports);
const previous=process.env.NEXT_PUBLIC_PILOT_OAUTH_ENABLED;
afterAll(()=>{if(previous===undefined)delete process.env.NEXT_PUBLIC_PILOT_OAUTH_ENABLED;else process.env.NEXT_PUBLIC_PILOT_OAUTH_ENABLED=previous;});
test.each(['false','true'])('email login remains visible with OAuth flag %s',flag=>{
 process.env.NEXT_PUBLIC_PILOT_OAUTH_ENABLED=flag;
 const html=renderToStaticMarkup(React.createElement(screen.exports.default));
 expect(html).toContain('type="email"');expect(html).toContain('type="password"');expect(html).toContain('<form');
 expect(html.includes('Continue with Google')).toBe(flag==='true');
});
