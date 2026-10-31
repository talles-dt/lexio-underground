import Link from 'next/link';
import sequences from '../../curriculum/english-v0.2/data/lexical-sequences.json';

export default function CurriculumPage() {
  return (
    <main className="min-h-screen bg-[#101010] px-6 py-16 text-[#f3eee5]">
      <div className="mx-auto max-w-3xl space-y-8">
        <Link href="/learn" className="text-sm text-amber-300">← Voltar ao Lexio</Link>
        <p className="text-sm uppercase tracking-widest text-amber-300">Lexio · Biblioteca curricular</p>
        <h1 className="text-4xl font-semibold">Inglês, do pré-A1 ao C1</h1>
        <p className="text-lg leading-relaxed">Materiais para adultos brasileiros, com percursos de estudo autônomo e com professor. Esta entrega reúne 446 entradas lexicais e 87 sequências de prática, além das unidades e dos materiais de gramática já escritos.</p>
        <section className="rounded-2xl border border-amber-300/30 p-6 space-y-3">
          <h2 className="text-xl font-semibold">Edição editorial · 31 de outubro de 2026</h2>
          <p className="leading-relaxed text-stone-300">Material revisado e aprovado editorialmente pelo responsável pelo projeto. A ampliação da cobertura e a pilotagem continuam em andamento. Os roteiros de áudio ainda não têm gravações.</p>
          <p className="leading-relaxed text-stone-300">O pacote inclui materiais de aluno e professor, respostas comentadas, avaliações e relatórios de cobertura. As sequências estão disponíveis abaixo para estudo e uso com professor. Respostas e avaliações permanecem em documentos separados; esta biblioteca não registra conclusão nem atribui proficiência.</p>
        </section>
        <Link href="/curriculum/read/README.md" className="block text-amber-300 underline">Abrir guia do curso, unidades e materiais de gramática</Link>
        {['pre-a1','a1','a2','b1','b2','c1'].map(level => <section key={level} className="space-y-4">
          <h2 className="text-2xl font-semibold">{level === 'pre-a1' ? 'Pré-A1' : level.toUpperCase()}</h2>
          <ul className="space-y-3">{sequences.filter(s=>s.level===level).map(s=><li key={s.id} className="rounded-xl border border-stone-700 p-4">
            <h3 className="font-semibold"><Link href={'/curriculum/read/'+s.student}>{s.title}</Link></h3>
            <p className="text-sm text-stone-400">Retomar após {s.after}</p>
            <div className="mt-3 flex flex-wrap gap-4 text-sm text-amber-300">
              <Link href={'/curriculum/read/'+s.student}>Estudar</Link>
              <Link href={'/curriculum/read/'+s.review}>Revisar</Link>
              <Link href={'/curriculum/read/'+s.assessment}>Avaliação</Link>
              <Link href={'/curriculum/read/'+s.teacher}>Professor</Link>
              <Link href={'/curriculum/read/'+s.feedback}>Respostas comentadas</Link>
            </div>
          </li>)}</ul>
        </section>)}
        <a className="inline-block rounded-xl bg-amber-300 px-6 py-3 font-semibold text-black" href="/curriculum/lexio-english-2026-10-31.zip" download>Baixar os materiais (ZIP)</a>
        <p className="text-sm text-stone-400">Abra o README da pasta english-v0.2 para navegar pelos materiais. Os documentos estão em Markdown, com dados e fontes editoriais incluídos.</p>
      </div>
    </main>
  );
}
