# Lexio — primeira implementação do piloto

09/10/2026 · Branch `codex/lexio-mvp-foundation`.

Lexio Underground é o produto. Pulse, Palácio, Shadow, Phonos e Syntaxis são os componentes. Cartógrafa é uma frente separada. Esta entrega é um piloto inicial de prática, não o MVP curricular completo pré-A1–C1.

## Entregue no código

- Entrada em `/learn` e acesso direto aos cinco componentes; primeira atividade sem cadastro obrigatório.
- Pulse e Syntaxis reaproveitam o catálogo `syntaxis-beta-2026.10`, preservando IDs. Apenas conteúdo marcado como publicado entra na seleção pré-A1/A1/A2. Há respostas, comparação com modelos e produções abertas sem nota automática. O Phrasal Lab inclui exemplos guardáveis.
- Palácio recebe itens reais, impede duplicação e agenda revisão a partir da reflexão do aluno. Não calcula CEFR.
- Phonos reaproveita as 20 sessões do projeto existente, com instruções, alvos, IPA, referências e gravações locais de palavras/frase. A voz de referência é sintética e local, quando disponível. A reflexão depende de duas capturas, sem alegação de avaliação acústica.
- Shadow oferece um ensaio guiado de rotina em três turnos. **Ainda não oferece IA, transcrição ou resposta adaptada à gravação.** Isso está explícito na interface.
- Histórico local por identidade, exportação/importação, validação de arquivos e deduplicação. Escrita deve ter sucesso antes da confirmação. Áudios não entram no histórico e não são enviados.
- Sincronização e exclusão remotas implementadas, mas contas ficam desativadas por padrão (`NEXT_PUBLIC_PILOT_ACCOUNTS_ENABLED=false`) até validar o ambiente remoto. O piloto publicado de revisão usa modo visitante.
- Zernio removido da interface, handlers, cliente e dependências. Endpoints antigos retornam indisponibilidade sem chamada ao provedor.
- APIs antigas de diagnóstico, geração, cobrança e demais superfícies sem gate aprovado foram colocadas em quarentena: retornam 503 no handler, além da barreira no middleware. Não tratar isso como implementação funcional dessas features.
- Cartógrafa e preços mostram estado explícito; não há cobrança nem diagnóstico simulado. Notificações inventadas removidas. Zoom liberado.
- Auth usa o cliente SSR padrão; reset do estado na saída/troca de conta; cargas assíncronas antigas não sobrescrevem a identidade atual.
- Migração aditiva para eventos e fechamento de grants/RLS auditados. Nenhum dado remoto foi alterado nesta entrega.

## Preservação e proveniência

As alterações locais preexistentes e fontes não rastreadas foram preservadas antes de editar em arquivo privado de recuperação no workspace de implementação. Migrações Liceu anteriores não foram alteradas nem executadas. Não executar todo o histórico de migrações contra um banco existente: há uma migração antiga destrutiva.

Catálogo Syntaxis: checkout local do trabalho de 06/10/2026, arquivos `src/syntaxis/catalog.ts` e `types.ts`. Phonos: checkout local do trabalho de 03/10/2026, `src/data/sessions.json`. Esta integração não afirma que todo esse conteúdo passou por novo piloto pedagógico ou cobre C1.

## Validação

Executar `npm ci`, `npm run lint`, `npm run typecheck`, `npm run test:ci`, `npm run build`. A pipeline de CI contém essas etapas. Para reproduzir a bateria SQL localmente, execute `npm run test:security` com Docker disponível; o runner cria um banco descartável sem rede e nunca usa o banco do projeto. Os testes legados não substituem os testes do novo percurso.

`tests/pilot/progress.test.ts` cobre validação de histórico, separação de identidades, deduplicação, revisão e quarentena. `tests/pilot/security.sql` foi executado em PostgreSQL descartável, com os papéis e esquema Auth mínimos e as migrações base relevantes: bloqueio de elevação de role/tier, isolamento de leitura/escrita/exclusão, imutabilidade de eventos, reenvio idempotente e negação a anônimos.

Verificação no navegador: resposta Pulse → guardar item → Palácio → revisão → recarregar e confirmar persistência; resposta Syntaxis; interface Phonos; largura móvel 390 px. **Microfones físicos Android/iOS, qualidade de voz, OAuth e sincronização remota ainda exigem validação.**

## Próximo gate de implementação

1. Confirmar projeto Supabase de destino e comparar schema/migration history, inclusive coexistência com Syntaxis/Liceu.
2. Fazer backup verificável; aplicar somente a migração nova após revisão contra o schema real. A migração local não corrige o banco remoto por si só.
3. Rotacionar a credencial que estava no arquivo rastreado e eventuais credenciais exclusivas do Zernio. Remover a linha do arquivo não revoga um segredo.
4. Testar login, logout, duas contas, sincronização, exclusão e retomada entre dispositivos. Só então habilitar contas no build e runtime.
5. Validar gravação real e produzir modelos de áudio revisados. Substituir ensaio Shadow pela conversa real conforme N13–N15, com acesso/cotas e falhas explícitas.
6. Retomar Cartógrafa na frente própria, publicar conteúdo por ondas e completar o curso até C1. Reabrir cada endpoint somente com testes e gate correspondente.

A remoção de superfícies antigas neste piloto não extingue direitos comerciais existentes. Checkout e resgates ficam indisponíveis até M4; não promover sobre uma operação comercial ativa sem reconciliação de usuários e atendimento.

## Resultado desta execução

- Preview de revisão: https://code-2dgcsvr1c-tallestonatto-5836s-projects.vercel.app/learn (pode exigir acesso Vercel). O domínio de produção existente não foi promovido.
- Build, tipos e lint passaram; lint mantém dois avisos em componentes legados fora do piloto.
- 89 testes passaram, um teste legado permanece ignorado. A bateria SQL de isolamento passou no banco descartável.
- No preview, verificado Pulse → item no Palácio → recarga mantendo o item. Probes autenticados retornaram 410 para Zernio, 503 para os recursos em quarentena e 200 para liveness.
- Auditoria de dependências de execução após limpeza: zero alertas críticos; sete alertas restantes (cinco altos e dois moderados), inclusive dependências transitivas. F18 permanece parcial e requer tratamento antes de promoção ampla.
- Microfone real, sincronização remota, OAuth, validação pedagógica, Cartógrafa, Shadow com IA e currículo completo até C1 não foram certificados nesta entrega.
