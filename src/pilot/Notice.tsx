"use client";
import Link from 'next/link';
import { GrainOverlay } from '@/lib/stitch-motion';
import './pilot.css';
export default function Notice({title, children}: {title:string; children:React.ReactNode}) {
  return <main className="lexio-pilot"><GrainOverlay/><div className="pilot-masthead"><Link className="lexio-wordmark" href="/">LEXIO<span>UNDERGROUND</span></Link><span className="pilot-edition">ESTUDO · MEMÓRIA · DESCOBERTA</span></div><header className="pilot-header"><div><p className="eyebrow">SEU ESPAÇO NO LEXIO</p><h1>{title}</h1></div></header><section className="pilot-panel"><div className="pilot-lede">{children}</div><p style={{marginTop:32}}><Link href="/learn">Entrar na prática →</Link></p></section></main>;
}
