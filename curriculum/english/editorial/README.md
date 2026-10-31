# Arquivos de autoria e revisão

- `generate.py`: fonte de autoria dos 48 pacotes e 6 avaliações. Gera unidades, cadernos, matriz, cobertura, README e projeções JSON. Executar somente para reconstruir esses documentos; edições manuais neles seriam sobrescritas.
- `units.json` e `assessments.json`: projeções estruturadas para inspeção e futura importação, sem contrato de API pública.
- `validate.py`: verifica integridade documental e grava `integrity-report.json`. Não avalia mérito pedagógico.
- Os documentos mestre, rubricas, laboratório, dossiê e protocolo são mantidos diretamente em Markdown, fora do gerador.

Comandos locais, a partir desta pasta: `python generate.py` e `python validate.py`. Não exigem bibliotecas adicionais. Não publicam conteúdo, não acessam contas e não alteram a aplicação.

Fluxo de mudança: editar fonte apropriada → reconstruir se necessário → verificar → revisar conteúdo afetado → atualizar versão e histórico antes de publicar. Conservar uma edição fixada quando houver alunos utilizando o material.
