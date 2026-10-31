import Link from 'next/link';
import { notFound } from 'next/navigation';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import materials from '../../../../src/curriculum/materials.json';

export default async function MaterialPage({params}: {params: Promise<{slug: string[]}>}) {
  const {slug} = await params;
  const key = slug.join('/');
  const content = (materials as Record<string,string>)[key];
  if (typeof content !== 'string') notFound();
  const resolve = (href: string) => {
    if (/^(https?:|mailto:|#)/.test(href)) return href;
    const path = new URL(href, 'https://lexio.invalid/' + key);
    const target = decodeURIComponent(path.pathname.slice(1));
    return Object.prototype.hasOwnProperty.call(materials, target) ? '/curriculum/read/' + target + path.hash : undefined;
  };
  return <main className="min-h-screen bg-[#101010] px-6 py-12 text-[#f3eee5]"><div className="mx-auto max-w-3xl">
    <Link className="text-amber-300" href="/curriculum">← Currículo de inglês</Link>
    <p className="my-6 text-sm text-stone-400">Material revisado pelo responsável pelo projeto · edição 31/10/2026</p>
    <article className="space-y-5 leading-relaxed [&_h1]:text-3xl [&_h2]:text-2xl [&_h3]:text-xl [&_h2]:pt-6 [&_h3]:pt-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:my-2 [&_a]:text-amber-300 [&_a]:underline [&_table]:block [&_table]:overflow-x-auto [&_td]:border [&_td]:border-stone-700 [&_td]:p-3 [&_th]:p-3 [&_blockquote]:border-l-2 [&_blockquote]:border-amber-300 [&_blockquote]:pl-4">
      <Markdown remarkPlugins={[remarkGfm]} components={{a: ({href,children}) => {const target=resolve(href || '');return target ? <a href={target}>{children}</a> : <span>{children}</span>;}}}>{content}</Markdown>
    </article>
  </div></main>;
}
