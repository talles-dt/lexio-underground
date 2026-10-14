# Lexio — primeira implementação do piloto

Atualizado em 12/10/2026 · Branch `codex/lexio-mvp-foundation`.

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
- Migração aditiva para eventos e fechamento de grants/RLS auditados. Em 11/10, as três migrações indicadas abaixo foram aplicadas no banco Lexio; os registros existentes foram preservados.

## Preservação e proveniência

As alterações locais preexistentes e fontes não rastreadas foram preservadas antes de editar em arquivo privado de recuperação no workspace de implementação. Migrações Liceu anteriores não foram alteradas nem executadas. Não executar todo o histórico de migrações contra um banco existente: há uma migração antiga destrutiva.

Catálogo Syntaxis: checkout local do trabalho de 06/10/2026, arquivos `src/syntaxis/catalog.ts` e `types.ts`. Phonos: checkout local do trabalho de 03/10/2026, `src/data/sessions.json`. Esta integração não afirma que todo esse conteúdo passou por novo piloto pedagógico ou cobre C1.

## Validação

Executar `npm ci`, `npm run lint`, `npm run typecheck`, `npm run test:ci`, `npm run build`. A pipeline de CI contém essas etapas. Para reproduzir a bateria SQL localmente, execute `npm run test:security` com Docker disponível; o runner cria um banco descartável sem rede e nunca usa o banco do projeto. Os testes legados não substituem os testes do novo percurso.

`tests/pilot/progress.test.ts` cobre validação de histórico, separação de identidades, deduplicação, revisão e quarentena. `tests/pilot/security.sql` foi executado em PostgreSQL descartável, com os papéis e esquema Auth mínimos e as migrações base relevantes: bloqueio de elevação de role/tier, isolamento de leitura/escrita/exclusão, imutabilidade de eventos, reenvio idempotente e negação a anônimos.

Verificação no navegador: resposta Pulse → guardar item → Palácio → revisão → recarregar e confirmar persistência; resposta Syntaxis; interface Phonos; largura móvel 390 px. **Microfones físicos Android/iOS, qualidade de voz, OAuth e sincronização remota ainda exigem validação.**

## Próximo gate de implementação

1. Concluído em 11/10: projeto Lexio `uykmqubeuopfvyctbipn` confirmado, esquema e histórico comparados; o vínculo local incorreto com Liceu foi corrigido.
2. Concluído em 11/10: cópias privadas de esquema e dados, manifesto SHA-256, verificação dos blocos COPY e das duas linhas de perfil; aplicação somente das três migrações novas e conferência remota. A restauração integral do backup não foi ensaiada.
3. Rotacionar a credencial que estava no arquivo rastreado e eventuais credenciais exclusivas do Zernio. Remover a linha do arquivo não revoga um segredo.
4. Testar login, logout, duas contas, sincronização, exclusão e retomada entre dispositivos. Só então habilitar contas no build e runtime.
5. Validar gravação real e produzir modelos de áudio revisados. Substituir ensaio Shadow pela conversa real conforme N13–N15, com acesso/cotas e falhas explícitas.
6. Retomar Cartógrafa na frente própria, publicar conteúdo por ondas e completar o curso até C1. Reabrir cada endpoint somente com testes e gate correspondente.

A remoção de superfícies antigas neste piloto não extingue direitos comerciais existentes. Checkout e resgates ficam indisponíveis até M4; não promover sobre uma operação comercial ativa sem reconciliação de usuários e atendimento.

## Resultado desta execução

- Preview de revisão: https://code-j7vn0otxu-tallestonatto-5836s-projects.vercel.app/learn (pode exigir acesso Vercel). O domínio de produção existente não foi promovido.
- Build, tipos e lint passaram; lint mantém dois avisos em componentes legados; o Palácio reutiliza um deles.
- 89 testes passaram, um teste legado permanece ignorado. A bateria SQL de isolamento passou no banco descartável.
- No preview, verificado Pulse → item no Palácio → recarga mantendo o item. Probes autenticados retornaram 410 para Zernio, 503 para os recursos em quarentena e 200 para liveness.
- Auditoria de dependências de execução após limpeza: zero alertas críticos; sete alertas restantes (cinco altos e dois moderados), inclusive dependências transitivas. F18 permanece parcial e requer tratamento antes de promoção ampla. Incluindo ferramentas de desenvolvimento, a auditoria registra 51 alertas (um crítico, 45 altos e cinco moderados); esses números não equivalem a 51 falhas exploráveis da aplicação.
- Microfone real, sincronização remota, OAuth, validação pedagógica, Cartógrafa, Shadow com IA e currículo completo até C1 não foram certificados nesta entrega.

## Correção visual após revisão do usuário

A primeira interface do piloto simplificou excessivamente a identidade do produto. Esta revisão recupera a entrada original, a textura, a paleta obsidiana/marfim/fósforo, as famílias tipográficas do projeto e a planta tridimensional existente do Palácio. As atividades ficam nessa linguagem visual, com navegação entre os cinco componentes e barra inferior no celular. Cartógrafa continua separada e recebe uma tela de aviso consistente.

A planta se ajusta à largura disponível; as salas também têm botões acessíveis. A aparência da planta não representa nível adquirido nem desbloqueio pedagógico. O salvamento local continua funcionando: resposta no Pulse, envio ao Palácio e navegação com o item preservado foram conferidos novamente em 390 px. Build passou e os 89 testes existentes passaram (um ignorado). Isso não certifica o currículo completo até C1 nem todos os fluxos antigos.

Prévia visual publicada e conferida no navegador: `59da974`. A compilação remota também passou. O domínio de produção existente permanece sem promoção.


## Continuidade — 11–12/10/2026

### Jornada e Palácio

- `/learn` retoma componente, faixa escolhida, unidade, atividade, turno de ensaio e sala. A entrada direta em um componente respeita a rota; a navegação interna passa ao workspace comum.
- Rascunhos por atividade e identidade são guardados localmente a cada edição, separados dos eventos de resposta. Erro de armazenamento preserva o texto em tela e avisa para copiar. Texto vazio permanece vazio ao retomar. Exportação de rascunhos separada do histórico; não há importação de rascunhos nesta etapa.
- Pulse/Phrasal Lab permitem escolher uma das cinco salas. Memórias antigas continuam em Estruturas; movimentação de sala é um novo evento imutável e preserva conteúdo, contagem e data de revisão.
- Contagem por sala, filtro de revisões pendentes e ordenação por data. Um lapso reinicia o intervalo de revisão; não usa mais o total histórico de tentativas para avançar logo após um lapso.
- Syntaxis mostra quantas atividades têm respostas registradas, sem afirmar domínio. O Phrasal Lab exibe todos os verbos catalogados na faixa escolhida, removendo o corte arbitrário em 12.
- Identidade visual aprovada preservada. Gravações continuam temporárias e não são restauradas junto dos rascunhos.

### Banco remoto

Destino confirmado: `lexio-underground`, `uykmqubeuopfvyctbipn`; Liceu não recebeu estas alterações. A inspeção encontrou as tabelas Syntaxis já existentes no Lexio. O vínculo CLI do checkout apontava para Liceu e foi corrigido para Lexio.

Aplicadas em uma transação e posteriormente registradas/verificadas no histórico:

- `20261009043723_lexio_pilot_security_events.sql`
- `20261011030938_palace_room_events.sql`
- `20261011031404_close_legacy_profile_privileges.sql`

Verificação remota: anônimo sem SELECT em perfis/diagnósticos; usuário autenticado sem UPDATE em role/tier e sem TRUNCATE nas duas tabelas; atualização de nome preservada. Tabela de eventos com RLS e três políticas por identidade. As duas linhas de perfil e zero diagnósticos foram preservados. Catálogo Syntaxis não foi alterado. Isto não verifica OAuth nem a experiência de duas contas no navegador.

Evidências privadas em `work/lexio-implementation/remote-readonly` no workspace da tarefa: relatórios de esquema e permissões, dumps e manifesto. Dumps têm dados privados e não pertencem ao Git/deploy. Backup com 30 blocos COPY completos; há referências circulares no Syntaxis, portanto uma restauração integral precisa respeitar a ordem/constraints e ainda requer ensaio. Não executar todo o histórico local de migrações: há versões legadas divergentes e uma migração destrutiva.

### Validação e limites desta etapa

98 testes passaram, um legado ignorado; testes SQL de isolamento e de movimentação de sala passaram em PostgreSQL descartável. Bateria SQL adicionada à CI, ainda sem alegação de execução remota do workflow. Build, tipos e lint passaram, mantendo dois avisos legados.

No navegador: rascunho Pulse após recarga; guardar em Vocabulário, revisar, mover para Cultura e reabrir com data preservada; Syntaxis reabriu em Transformar com o rascunho do dia anterior. Rascunhos e histórico visitante ficam no navegador/origem. Para levar histórico entre URLs de prévia, exportar na origem anterior e importar na nova.

Contas permanecem desligadas na prévia até validar login, saída, troca de conta e sincronização ponta a ponta. A credencial anteriormente exposta ainda precisa de rotação. Microfones reais, Shadow com IA, Cartógrafa, conteúdo e validação pedagógica até C1 seguem pendentes. Esta entrega avança M0/M1/M2; não encerra o MVP.


### Prévia desta etapa

https://code-pli76ceh2-tallestonatto-5836s-projects.vercel.app/learn

Código `f633e46`; deployment `dpl_EuNUzzQbEtdPoqoMaspYSTw1ENiB`, preview READY em 12/10, compilação remota aprovada. Navegador no preview confirmou entrada direta em `/pulse` → Syntaxis em `/learn` → Transformar → rascunho → recarga com componente, atividade e texto preservados. O domínio de produção da aplicação não foi promovido; as correções de permissões descritas acima foram efetivamente aplicadas no banco remoto Lexio.

## Contas e sincronização — encerramento em 13/10/2026

A prévia desta etapa habilita contas confirmadas por e-mail/senha e sincronização manual com consentimento:
https://code-ac2miowl6-tallestonatto-5836s-projects.vercel.app/learn

Deployment `dpl_7RuUhJPHw7Kfmp2YzWsTY11ggtug`. Build e runtime usam `NEXT_PUBLIC_PILOT_ACCOUNTS_ENABLED=true`; `NEXT_PUBLIC_PILOT_OAUTH_ENABLED=false`. Substitui o estado de contas desligadas descrito nas etapas anteriores. Produção não foi promovida.

### Correções

- Login termina em `/learn`; o formulário de e-mail permanece disponível quando OAuth está oculto, com campos associados aos respectivos rótulos.
- Callback PKCE usa cookies SSR, destino interno permitido, resposta sem cache e erro explícito para código ausente/inválido. Recuperação de senha exige sessão validada; tokens brutos não são lidos da URL pela tela.
- Inicialização da sessão e mudanças posteriores usam o mesmo fluxo de eventos, evitando a corrida entre uma leitura inicial antiga e a saída.
- Saída tem confirmação dentro da página, limpa histórico e caderno locais daquela conta e retorna ao visitante. O aviso informa que rascunhos não sincronizados precisam ser exportados antes. A confirmação nativa bloqueava o navegador integrado durante o teste; foi substituída.
- Sincronização valida identidade, cancela operações desmontadas, pagina leituras em 500 registros e envia em lotes de 100. Reenvio é idempotente. Alterações feitas durante uma sincronização são indicadas como pendentes; falhas preservam o histórico local.

### Evidências

- 114 testes passaram; um teste legado ignorado. Incluem renderização real da tela de entrada com OAuth ligado/desligado, isolamento das operações de sync, cancelamento, falhas, novas edições concorrentes, paginação e lotes. Tipos, lint e compilação remota passaram; os dois avisos legados de hooks permanecem.
- Duas contas temporárias confirmadas pelo administrador, sem envio de e-mails, no projeto Lexio `uykmqubeuopfvyctbipn`. Login real, reenvio sem duplicação, sessão nova recuperando dados, leitura/inserção/exclusão entre contas bloqueadas, exclusão própria e posterior reenvio verificados por clientes reais. Alteração de `public.users.role` negada com código de permissão `42501`.
- Navegador: conta A salvou resposta e memória localmente e sincronizou. Conta B permaneceu com zero registros mesmo após sincronizar. Uma origem de prévia sem histórico local recuperou a resposta e a memória de A. Nova resposta escrita na prévia foi confirmada por leitura independente do banco. Recarga preservou sessão, atividade e resposta.
- Prévia final: A recuperou quatro eventos; saída confirmada na página seguida de recarga manteve visitante com zero registros locais; B entrou e sincronizou permanecendo com zero. B também saiu normalmente. Recuperação sem sessão mostrou link inválido/expirado. `/admin` sem sessão retornou 401; callback sem código retornou 307 para `/signin?error=auth`.
- As duas contas temporárias foram excluídas após os testes; zero eventos delas permaneceram. Os dois perfis originais em `public.users` foram comparados antes/depois da limpeza e permaneceram iguais. Relatórios privados sem tokens estão no diretório de trabalho `account-validation`.

### Limites

Validação com sessões/origens separadas no mesmo computador, não com dois aparelhos físicos. Confirmação de cadastro e recuperação por e-mail (entrega, links e configuração de destinos) e OAuth não foram certificados; provedores externos ficam ocultos. O sync cobre respostas, reflexões, memórias e revisões; rascunhos, cursor e gravações continuam locais. A rotação da credencial anteriormente exposta permanece pendente. Nada nesta etapa certifica Cartógrafa, microfone real, Shadow com IA ou currículo completo até C1.

### E-mail real e retorno de confirmação — 13/10/2026

O SMTP antigo do Zoho retornou `535 5.7.8 Authentication Failed` em `/signup`. Após o usuário migrar as credenciais para Lark Mail (`smtp.larksuite.com:465`), o cadastro real enviou a confirmação: `/verify` retornou 303, `email_confirmed_at` foi preenchido e houve login manual posterior. Isso valida envio/recebimento/confirmação desse cadastro, sem certificar ainda recuperação de senha ou OAuth.

A mensagem antiga do callback confundia confirmação do endereço com abertura da sessão. Falha retornada ou exceção na troca de código agora encaminha para orientação de login manual, sem afirmar que o e-mail não foi confirmado. Recuperação tem orientação própria para uso do mesmo navegador ou solicitação de novo link. Código ausente continua sendo erro e nunca vira sucesso. O motivo específico da falha de abertura da sessão do usuário ainda não foi comprovado; abrir o link em outro navegador é uma hipótese compatível com PKCE. Não foi implementada confirmação por token hash nem suporte a troca de navegador nesta correção.

119 testes passaram, um legado ignorado; tipos passaram. Cinco novos testes exercitam o callback real com sucesso, erro retornado, exceção, recuperação e ausência de código. Nenhuma senha ou token do usuário foi lido ou registrado.

Prévia da correção: https://code-dfg0i0sor-tallestonatto-5836s-projects.vercel.app/learn — código `2618f03`, deployment `dpl_4Yr65xB7q66w6WNGU2fpj8WUpNa5`. Compilação remota aprovada. Navegador verificou callback com código fictício sem verificador → `/signin?error=session`, exibindo a orientação de login manual. Esse teste negativo não certifica abertura automática de sessão com um link real.
