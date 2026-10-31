import Link from 'next/link';

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
          <p className="leading-relaxed text-stone-300">Conteúdo em desenvolvimento. A cobertura integral, a revisão pedagógica independente e a pilotagem ainda estão pendentes. Os roteiros de áudio ainda não têm gravações.</p>
          <p className="leading-relaxed text-stone-300">O pacote inclui materiais de aluno e professor, respostas comentadas, avaliações e relatórios de cobertura. As novas sequências ainda não fazem parte do percurso interativo da aplicação.</p>
        </section>
        <a className="inline-block rounded-xl bg-amber-300 px-6 py-3 font-semibold text-black" href="/curriculum/lexio-english-2026-10-31.zip" download>Baixar os materiais (ZIP)</a>
        <p className="text-sm text-stone-400">Abra o README da pasta english-v0.2 para navegar pelos materiais. Os documentos estão em Markdown, com dados e fontes editoriais incluídos.</p>
      </div>
    </main>
  );
}
