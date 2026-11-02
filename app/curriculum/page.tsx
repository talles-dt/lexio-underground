import Link from 'next/link';
import release from '../../src/curriculum/release.json';
import sequences from '../../curriculum/english-v0.2/data/lexical-sequences.json';
import consolidations from '../../curriculum/english-v0.2/data/consolidation.json';

export default function CurriculumPage() {
  return (
    <main className="min-h-screen bg-[#101010] px-6 py-16 text-[#f3eee5]">
      <div className="mx-auto max-w-3xl space-y-8">
        <Link href="/learn" className="text-sm text-amber-300">← Voltar ao Lexio</Link>
        <p className="text-sm uppercase tracking-widest text-amber-300">Lexio · Biblioteca curricular</p>
        <h1 className="text-4xl font-semibold">Inglês, do pré-A1 ao C1</h1>
        <p className="text-lg leading-relaxed">Materiais para adultos brasileiros, com percursos de estudo autônomo e com professor. Esta entrega reúne {release.lexical_entries} entradas lexicais e {release.lexical_sequences} sequências de prática, além das unidades e dos materiais de gramática já escritos.</p>
        <section className="rounded-2xl border border-amber-300/30 p-6 space-y-3">
          <h2 className="text-xl font-semibold">Edição editorial · {release.edition.split('-').reverse().join('/')}</h2>
          <p className="leading-relaxed text-stone-300">{release.reviewed_sequences} sequências têm revisão editorial registrada pelo responsável pelo projeto. Outras {release.new_or_changed_sequences} foram acrescentadas ou alteradas depois dessa revisão. A cobertura continua em expansão; pilotagem e gravações de áudio permanecem pendentes.</p>
          <p className="leading-relaxed text-stone-300">O pacote inclui materiais de aluno e professor, respostas comentadas, avaliações e relatórios de cobertura. As sequências estão disponíveis abaixo para estudo e uso com professor. Respostas e avaliações permanecem em documentos separados; esta biblioteca não registra conclusão nem atribui proficiência.</p>
        </section>
        <Link href="/curriculum/read/README.md" className="block text-amber-300 underline">Abrir guia do curso, unidades e materiais de gramática</Link>
        <section className="rounded-2xl border border-amber-300/30 p-6 space-y-3">
          <h2 className="text-xl font-semibold">Percurso prioritário: pré-A1 até B1</h2>
          <p className="leading-relaxed text-stone-300">Depois das novas sequências de cada nível, reúna o que estudou em tarefas de leitura, conversa, escrita e transmissão de informações. Cada encontro inclui orientação ao professor, retomada e avaliação em situação nova.</p>
          <Link href="/curriculum/read/reports/PRIORITY-THROUGH-B1.md" className="block text-amber-300 underline">Ver ordem de estudo e conteúdos ainda em expansão</Link>
          <ul className="space-y-3">{consolidations.map(unit => <li key={unit.id}>
            <Link href={'/curriculum/read/'+unit.student} className="text-amber-300 underline">{unit.level === 'pre-a1' ? 'Pré-A1' : unit.level.toUpperCase()} · {unit.title}</Link>
          </li>)}</ul>
        </section>
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
        <a className="inline-block rounded-xl bg-amber-300 px-6 py-3 font-semibold text-black" href={'/curriculum/'+release.archive} download>Baixar os materiais (ZIP)</a>
        <p className="text-sm text-stone-400">Abra o README da pasta english-v0.2 para navegar pelos materiais. Os documentos estão em Markdown, com dados e fontes editoriais incluídos.</p>
      </div>
    </main>
  );
}
