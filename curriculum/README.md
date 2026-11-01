# Lexio English — entrega editorial de 31/10/2026

Snapshot do vault `07-curriculum`, preservado para versionamento e publicação. A fonte editorial continua no vault; atualizações devem ser regeneradas e validadas antes de substituir este snapshot.

- Edição atual: [english-v0.2](english-v0.2/README.md).
- Protótipo original preservado em `english` para verificação de integridade.
- 446 entradas lexicais, 87 sequências; pré-A1 a C1.
- Material autoral revisado pelo responsável pelo projeto em 31/10/2026; ver english-v0.2/EDITORIAL-APPROVAL.md. Cobertura integral, pilotagem e produção de áudio permanecem pendentes.
- A biblioteca /curriculum disponibiliza navegação por nível, sequências e leitor de materiais; não registra progresso ou proficiência.

Verificação: `python3 curriculum/english-v0.2/editorial/validate.py`.
Pacote público: `/curriculum/lexio-english-2026-10-31.zip`; integridade: `/curriculum/release.json`.

## Expansão de 01/11/2026

530 entradas em 101 sequências; 87 sequências preservam os documentos revisados em 31/10 e 14 são novas. A biblioteca deriva contagens do inventário e identifica revisão por documento. Gerar pacote com `python3 scripts/build-curriculum-release.py --edition YYYY-MM-DD`. O pacote anterior permanece disponível no seu endereço versionado.
