import Link from 'next/link';
import { notFound } from 'next/navigation';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import materials from '../../../../src/curriculum/materials.json';
import reviews from '../../../../src/curriculum/review-status.json';
import release from '../../../../src/curriculum/release.json';
import audioQueue from '../../../../curriculum/english-v0.2/data/audio-queue.json';
import ListeningPractice from '../../../../src/curriculum/ListeningPractice';

type HtmlNode = {type: string; value?: string; children?: HtmlNode[]; tagName?: string; properties?: Record<string,string>};
function curriculumAnchors() {
  return (tree: HtmlNode) => {
    const visit = (node: HtmlNode) => {
      if (node.type === 'raw') {
        const match = node.value?.match(/^<a id="([a-zA-Z0-9_-]+)">(?:\s*<\/a>)?$/);
        if (match) { node.type='element'; node.tagName='span'; node.properties={id:match[1]}; node.children=[]; delete node.value; }
      }
      node.children?.forEach(visit);
    };
    visit(tree);
  };
}

export default async function MaterialPage({params}: {params: Promise<{slug: string[]}>}) {
  const {slug} = await params;
  const key = slug.join('/');
  const content = (materials as Record<string,string>)[key];
  const review = (reviews as Record<string,{status: string; date: string | null}>)[key];
  if (typeof content !== 'string') notFound();
  const audio = audioQueue.find(item => !item.reserved_assessment && key.endsWith('/student.md') && item.source === key.replace(/student\.md$/, 'teacher.md'));
  const resolve = (href: string) => {
    if (/^(https?:|mailto:|#)/.test(href)) return href;
    const path = new URL(href, 'https://lexio.invalid/' + key);
    const target = decodeURIComponent(path.pathname.slice(1));
    if (audioQueue.some(item => item.audio_file === target)) return '/curriculum/' + target;
    return Object.prototype.hasOwnProperty.call(materials, target) ? '/curriculum/read/' + target + path.hash : undefined;
  };
  return <main className="min-h-screen bg-[#101010] px-6 py-12 text-[#f3eee5]"><div className="mx-auto max-w-3xl">
    <Link className="text-amber-300" href="/curriculum">← Currículo de inglês</Link>
    <p className="my-6 text-sm text-stone-400">{review?.status === 'reviewed_by_project_owner' ? `Revisão editorial registrada em ${review.date?.split('-').reverse().join('/')}` : 'Material novo ou atualizado após a última revisão editorial'} · edição {release.edition.split('-').reverse().join('/')}</p>
    {audio && (audio.audio_file ? <section className="my-8 space-y-3 rounded-xl border border-stone-700 p-5" aria-label="Escuta da atividade">
      <h2 className="text-xl">Ouça antes de ler</h2>
      <p className="text-sm text-stone-400">Áudio sintético de apoio, ainda em revisão de escuta. Nos diálogos, a voz anuncia quem fala. Não use como único modelo de pronúncia ou avaliação.</p>
      <audio controls preload="none" className="w-full" aria-label={`Áudio ${audio.id}`} src={'/curriculum/' + audio.audio_file}>Seu navegador não suporta áudio.</audio>
      <a className="text-amber-300 underline" href={'/curriculum/' + audio.audio_file} download>Baixar áudio</a>
      <details><summary className="cursor-pointer">Ver transcrição depois de ouvir</summary>{audio.dialogue.map((line,index) => <p key={index} className="mt-2"><strong>{line.speaker}:</strong> {line.text}</p>)}</details>
    </section> : <ListeningPractice key={audio.id} id={audio.id} dialogue={audio.dialogue} />)}
    <article className="space-y-5 leading-relaxed [&_h1]:text-3xl [&_h2]:text-2xl [&_h3]:text-xl [&_h2]:pt-6 [&_h3]:pt-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:my-2 [&_a]:text-amber-300 [&_a]:underline [&_table]:block [&_table]:overflow-x-auto [&_td]:border [&_td]:border-stone-700 [&_td]:p-3 [&_th]:p-3 [&_blockquote]:border-l-2 [&_blockquote]:border-amber-300 [&_blockquote]:pl-4">
      <Markdown skipHtml rehypePlugins={[curriculumAnchors]} remarkPlugins={[remarkGfm]} components={{a: ({href,children}) => {const target=resolve(href || '');return target ? <a href={target}>{children}</a> : <span>{children}</span>;}}}>{content}</Markdown>
    </article>
  </div></main>;
}
